import React, { useRef, useEffect } from "react";
import "./SwipeableItem.scss";
import DeleteIcon from "../../assets/delete-icon.svg";
import { useNavigate } from "react-router-dom";

function SwipeableItem({ title, subTitle, date, id, handleDelete }) {
  const listElementRef = useRef();
  const wrapperRef = useRef();
  const backgroundRef = useRef();

  const dragStartXRef = useRef(0);
  const leftRef = useRef(0);
  const draggedRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse);
    window.addEventListener("touchend", onDragEndTouch);
    return () => {
      window.removeEventListener("mouseup", onDragEndMouse);
      window.removeEventListener("touchend", onDragEndTouch);
    };
  });

  function onDragStartMouse(evt) {
    if (leftRef.current < -10) {
      return;
    }
    onDragStart(evt.clientX);
    window.addEventListener("mousemove", onMouseMove);
  }

  function onDragStartTouch(evt) {
    if (leftRef.current < -10) {
      return;
    }
    const touch = evt.targetTouches[0];
    onDragStart(touch.clientX);
    window.addEventListener("touchmove", onTouchMove);
  }

  function onDragStart(clientX) {
    draggedRef.current = true;
    dragStartXRef.current = clientX;

    listElementRef.current.className = "ListItem";

    requestAnimationFrame(updatePosition);
  }

  function updatePosition() {
    if (draggedRef.current) {
      requestAnimationFrame(updatePosition);
    }

    if (listElementRef.current) {
      listElementRef.current.style.transform = `translateX(${Math.max(
        leftRef.current,
        -100
      )}px)`;
    }
    if (backgroundRef.current) {
      backgroundRef.current.style.transform = `translateX(${Math.max(
        leftRef.current,
        0
      )}px)`;
    }
  }

  function onMouseMove(evt) {
    const left = evt.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onTouchMove(evt) {
    const touch = evt.targetTouches[0];
    const left = touch.clientX - dragStartXRef.current;
    if (left < 0) {
      leftRef.current = left;
    }
  }

  function onDragEndMouse(evt) {
    window.removeEventListener("mousemove", onMouseMove);
    onDragEnd();
  }

  function onDragEndTouch(evt) {
    window.removeEventListener("touchmove", onTouchMove);
    onDragEnd();
  }

  function onDragEnd() {
    if (draggedRef.current) {
      setTimeout(() => (draggedRef.current = false), 100);
      if (leftRef.current < 10 * -1) {
        leftRef.current = -100;
      } else {
        leftRef.current = 0;
      }
      listElementRef.current.className = "BouncingListItem";
      listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
    }
  }

  const handleClick = () => {
    if (leftRef.current > -10) {
      navigate(`/edit-employee/${id}`);
      return;
    }

    if (!draggedRef.current) {
      if (leftRef.current < -10) {
        leftRef.current = 0;
        listElementRef.current.className = "BouncingListItem";
        listElementRef.current.style.transform = `translateX(${leftRef.current}px)`;
      }
    }
  };

  return (
    <>
      <div className="Wrapper" ref={wrapperRef}>
        <div
          className="Background"
          ref={backgroundRef}
          onClick={() => handleDelete(id)}
        >
          <img src={DeleteIcon} alt="delete" />
        </div>
        <div
          className="BouncingListItem"
          ref={listElementRef}
          onMouseDown={onDragStartMouse}
          onTouchStart={onDragStartTouch}
          onClick={handleClick}
        >
          <div className="DataList">
            <h4>{title}</h4>
            <p>{subTitle}</p>
            <h6>{date}</h6>
          </div>
        </div>
      </div>
    </>
  );
}

export default SwipeableItem;
