const container = document.getElementById('viewer-container');
const img = document.getElementById('panorama');
const imageInput = document.getElementById('image-input');
let isDragging = false;
let startX = 0;
let imgX = 0;

// Handle image upload
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    img.src = url;
    img.onload = () => {
      img.style.left = '0px';
      imgX = 0;
    };
  }
});

container.addEventListener('mousedown', (e) => {
  if (!img.src) return;
  isDragging = true;
  startX = e.clientX;
  container.style.cursor = 'grabbing';
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  container.style.cursor = 'grab';
});

window.addEventListener('mousemove', (e) => {
  if (!isDragging || !img.src) return;
  const dx = e.clientX - startX;
  startX = e.clientX;
  imgX -= dx;

  // Wrapping logic for seamless 360 effect
  if (img.width > container.offsetWidth) {
    if (imgX < container.offsetWidth - img.width) {
      imgX = 0;
    }
    if (imgX > 0) {
      imgX = container.offsetWidth - img.width;
    }
  } else {
    imgX = 0;
  }
  img.style.left = imgX + 'px';
});

// Dark mode toggle
const darkModeBtn = document.getElementById('dark-mode-toggle');
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Joystick circular logic
const joystickBase = document.getElementById('joystick-base');
const joystickThumb = document.getElementById('joystick-thumb');
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joystickAnimationFrame = null;

function getRelativePosition(e, base) {
  const rect = base.getBoundingClientRect();
  let x, y;
  if (e.touches) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
  return { x, y };
}

function startJoystick(e) {
  joystickActive = true;
  const rect = joystickBase.getBoundingClientRect();
  joystickCenter = { x: rect.width / 2, y: rect.height / 2 };
  moveJoystick(e);
  joystickAnimationFrame = requestAnimationFrame(joystickLoop);
}

function moveJoystick(e) {
  if (!joystickActive) return;
  const pos = getRelativePosition(e, joystickBase);
  const dx = pos.x - joystickCenter.x;
  const dy = pos.y - joystickCenter.y;
  const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 30); // max 30px from center
  const angle = Math.atan2(dy, dx);
  const thumbX = joystickCenter.x + distance * Math.cos(angle) - 20;
  const thumbY = joystickCenter.y + distance * Math.sin(angle) - 20;
  joystickThumb.style.left = `${thumbX}px`;
  joystickThumb.style.top = `${thumbY}px`;
  joystickThumb.dataset.dx = dx;
  joystickThumb.dataset.dy = dy;
}

function endJoystick() {
  joystickActive = false;
  joystickThumb.style.left = '30px';
  joystickThumb.style.top = '30px';
  joystickThumb.dataset.dx = 0;
  joystickThumb.dataset.dy = 0;
  cancelAnimationFrame(joystickAnimationFrame);
}

function joystickLoop() {
  if (joystickActive) {
    const dx = parseFloat(joystickThumb.dataset.dx || 0);
    // Only use horizontal movement for panning
    if (Math.abs(dx) > 5) {
      imgX -= dx * 0.1; // Adjust speed as needed
      // Wrapping logic for seamless 360 effect
      if (img.width > container.offsetWidth) {
        if (imgX < container.offsetWidth - img.width) {
          imgX = 0;
        }
        if (imgX > 0) {
          imgX = container.offsetWidth - img.width;
        }
      } else {
        imgX = 0;
      }
      img.style.left = imgX + 'px';
    }
    joystickAnimationFrame = requestAnimationFrame(joystickLoop);
  }
}

// Mouse events
joystickBase.addEventListener('mousedown', startJoystick);
window.addEventListener('mousemove', moveJoystick);
window.addEventListener('mouseup', endJoystick);

// Touch events
joystickBase.addEventListener('touchstart', startJoystick);
window.addEventListener('touchmove', moveJoystick);
window.addEventListener('touchend', endJoystick);