import { useEffect } from "react";

function useIndexedDB(databaseName, storeName) {
  const idb =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

  useEffect(() => {
    if (!idb) {
      console.log("This browser doesn't support IndexedDB");
      return;
    }

    const request = idb.open(databaseName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      console.log("Database opened successfully");
    };

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.error);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [databaseName, storeName]);

  const addRecord = async (record) => {
    return new Promise((resolve, reject) => {
      const dbPromise = idb.open(databaseName, 1);
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.add(record);

        request.onsuccess = () => {
          transaction.oncomplete = function () {
            db.close();
          };
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      };
    });
  };

  const updateRecord = async (record) => {
    return new Promise((resolve, reject) => {
      const dbPromise = idb.open(databaseName, 1);
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put(record);

        request.onsuccess = () => {
          transaction.oncomplete = function () {
            db.close();
          };
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      };
    });
  };

  const getAllRecords = async () => {
    return new Promise((resolve, reject) => {
      const dbPromise = idb.open(databaseName, 1);
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;

        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          transaction.oncomplete = function () {
            db.close();
          };
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      };
    });
  };

  const getRecord = async (id) => {
    return new Promise((resolve, reject) => {
      const dbPromise = idb.open(databaseName, 1);
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => {
          transaction.oncomplete = function () {
            db.close();
          };
          console.log("result", request);
          resolve(request.result);
        };

        request.onerror = () => {
          reject(request.error);
        };
      };
    });
  };

  const deleteRecord = async (id) => {
    return new Promise((resolve, reject) => {
      const dbPromise = idb.open(databaseName, 1);
      dbPromise.onsuccess = () => {
        const db = dbPromise.result;
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => {
          transaction.oncomplete = function () {
            db.close();
          };
          resolve(id);
        };

        request.onerror = () => {
          reject(request.error);
        };
      };
    });
  };

  return {
    addRecord,
    getAllRecords,
    deleteRecord,
    getRecord,
    updateRecord
  };
}

export default useIndexedDB;
