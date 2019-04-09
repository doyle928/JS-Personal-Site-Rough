let i = 50;
let y = 310;
let checkHitBottomI = false;
let checkHitTopI = true;
let checkHitBottomY = true;
let checkHitTopY = false;
setInterval(() => {
  if (checkHitTopI === true) {
    i--;
    if (i === 39) {
      checkHitTopI = false;
      checkHitBottomI = true;
    }
  } else if (checkHitBottomI === true) {
    i++;
    if (i === 50) {
      checkHitTopI = true;
      checkHitBottomI = false;
    }
  }

  if (checkHitTopY === true) {
    y--;
    if (y === 310) {
      checkHitTopY = false;
      checkHitBottomY = true;
    }
  } else if (checkHitBottomY === true) {
    y++;
    if (y === 321) {
      checkHitTopY = true;
      checkHitBottomY = false;
    }
  }

  let textLeft = "rotate(" + i + "deg)";
  let textRight = "rotate(" + y + "deg)";

  $(".wave-part-left").css("transform", textLeft);
  $(".wave-part-right").css("transform", textRight);
}, 75);
