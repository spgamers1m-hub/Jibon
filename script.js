// SUPABASE CONNECTION
const SUPABASE_URL = "https://svssdgutduvnbevldglp.supabase.co";

const SUPABASE_KEY = "sb_publishable_zahHemY_4W7f0c363aHpIQ_mm1CqAHL";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
/* =====================================
   JIBON'S WORLD
   PART 2 - JAVASCRIPT
   BLOCK 1
===================================== */

const $ = id => document.getElementById(id);

let photos = JSON.parse(localStorage.getItem("jibonWorldPhotos") || "[]");
let hobbies = JSON.parse(localStorage.getItem("jibonWorldHobbies") || "[]");

let currentPhotos = [];
let viewerIndex = 0;
let slideshowTimer = null;
let logoTaps = 0;
let logoTapTimer = null;
let isAdmin = false;

const defaultHobbies = [
  {name:"Photography",description:"Capturing beautiful moments",icon:"📸"},
  {name:"Gaming",description:"Gaming is my passion",icon:"🎮"},
  {name:"Music",description:"Enjoying my favourite music",icon:"🎵"},
  {name:"Technology",description:"Exploring the digital world",icon:"💻"}
];

if (!hobbies.length) {
  hobbies = defaultHobbies;
  saveHobbies();
}

function savePhotos() {
  localStorage.setItem("jibonWorldPhotos",JSON.stringify(photos));
}

function saveHobbies() {
  localStorage.setItem("jibonWorldHobbies",JSON.stringify(hobbies));
}

/* WELCOME SCREEN */
$("enterBtn").addEventListener("click",() => {
  $("welcome").classList.add("hide");
  $("mainApp").classList.remove("hidden");
});


/* NAVIGATION */

function showPage(name) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const target = $("page-" + name);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active",button.dataset.page === name);
  });

  $("navbar").classList.remove("menu-open");
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click",() => showPage(button.dataset.page));
});

document.querySelectorAll("[data-open]").forEach(button => {
  button.addEventListener("click",() => showPage(button.dataset.open));
});

$("menuToggle").addEventListener("click",() => {
  $("navbar").classList.toggle("menu-open");
});

/* PHOTO CATEGORY */

document.querySelectorAll(".category-btn").forEach(button => {
  button.addEventListener("click",() => {
    document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    renderPhotos(button.dataset.category);
  });
});

/* PHOTO GALLERY */

function renderPhotos(category = "all") {
const grid = $("photoGrid");
grid.replaceChildren();

currentPhotos = photos.filter(photo =>
category === "all" || photo.category === category
);

if (!currentPhotos.length) {
const empty = document.createElement("div");
empty.className = "empty-state glass";
empty.textContent = "Your photos will appear here ✨";
grid.appendChild(empty);
return;
}

currentPhotos.forEach((photo,index) => {
const card = document.createElement("div");
card.className = "photo-card";

const img = document.createElement("img");  
img.src = photo.image;  
img.onerror = () => {
  console.log("IMAGE LOAD ERROR:", photo.image);
};

img.onload = () => {
  console.log("IMAGE LOADED:", photo.image);
};
img.alt = photo.title || "My photo";  
img.loading = "lazy";  

const title = document.createElement("h3");  
title.textContent = photo.title || "My Photo";  

card.append(img,title);  

card.addEventListener("click",() => {  
  openPhotoViewer(index,category);  
});  

grid.appendChild(card);

});
}

/* PHOTO VIEWER */

function openPhotoViewer(index,category = "all") {
  currentPhotos = photos.filter(photo =>
    category === "all" || photo.category === category
  );

  if (!currentPhotos.length) return;

  viewerIndex = index;
  $("photoViewer").classList.remove("hidden");
  showViewerPhoto();
}

function showViewerPhoto() {
  if (!currentPhotos.length) return;

  const photo = currentPhotos[viewerIndex];

  $("viewerImage").src = photo.image;
  $("viewerTitle").textContent = photo.title || "My Photo";
  $("viewerCounter").textContent =
    `${viewerIndex + 1} / ${currentPhotos.length}`;
}

function nextPhoto() {
  if (!currentPhotos.length) return;
  viewerIndex = (viewerIndex + 1) % currentPhotos.length;
  showViewerPhoto();
}

function previousPhoto() {
  if (!currentPhotos.length) return;
  viewerIndex = (viewerIndex - 1 + currentPhotos.length) % currentPhotos.length;
  showViewerPhoto();
}

function closeViewer() {
  $("photoViewer").classList.add("hidden");
  stopSlideshow();
  $("viewerImage").src = "";
}

$("viewerNext").addEventListener("click",nextPhoto);
$("viewerPrev").addEventListener("click",previousPhoto);
$("viewerClose").addEventListener("click",closeViewer);

$("photoViewer").addEventListener("click",event => {
  if (event.target === $("photoViewer")) closeViewer();
});

/* SLIDESHOW */

function stopSlideshow() {
  if (slideshowTimer) clearInterval(slideshowTimer);
  slideshowTimer = null;
  $("slideshowBtn").textContent = "▶ Slideshow";
}

$("slideshowBtn").addEventListener("click",() => {
  if (slideshowTimer) {
    stopSlideshow();
    return;
  }

  if (currentPhotos.length < 2) return;

  $("slideshowBtn").textContent = "Ⅱ Pause";
  slideshowTimer = setInterval(nextPhoto,3000);
});

/* KEYBOARD PHOTO CONTROLS */

document.addEventListener("keydown",event => {
  if ($("photoViewer").classList.contains("hidden")) return;

  if (event.key === "Escape") closeViewer();
  if (event.key === "ArrowRight") nextPhoto();
  if (event.key === "ArrowLeft") previousPhoto();
});

/* HOBBIES */

function renderHobbies() {
  const grid = $("hobbyGrid");
  grid.replaceChildren();

  hobbies.forEach((hobby,index) => {
    const card = document.createElement("button");
    card.className = "hobby-card glass";

    const icon = document.createElement("div");
    icon.className = "hobby-icon";
    icon.textContent = hobby.icon || "✨";

    const title = document.createElement("h3");
    title.textContent = hobby.name;

    const desc = document.createElement("p");
    desc.textContent = hobby.description;

    card.append(icon,title,desc);

    card.addEventListener("click",() => openHobby(index));
    grid.appendChild(card);
  });
}

function openHobby(index) {
  const hobby = hobbies[index];
  if (!hobby) return;

  $("hobbyDetailTitle").textContent = (hobby.icon || "✨") + " " + hobby.name;
  $("hobbyDetailText").textContent = hobby.description;
  $("hobbyDetail").classList.remove("hidden");
  $("hobbyGrid").classList.add("hidden");
  $("hobbyDetailImages").replaceChildren();
}

$("hobbyBack").addEventListener("click",() => {
  $("hobbyDetail").classList.add("hidden");
  $("hobbyGrid").classList.remove("hidden");
});

/* MEMORIES */

function renderMemories() {
  const grid = $("memoryGrid");
  grid.replaceChildren();

  const memories = photos.filter(photo => photo.category === "memory");

  if (!memories.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state glass";
    empty.textContent = "Your memories will appear here 🌌";
    grid.appendChild(empty);
    return;
  }

  memories.forEach((photo,index) => {
    const card = document.createElement("div");
    card.className = "memory-card glass";

    const icon = document.createElement("div");
    icon.textContent = "🌌";

    const title = document.createElement("h3");
    title.textContent = photo.title || "Special Memory";

    const text = document.createElement("p");
    text.textContent = "A special moment in my world.";

    card.append(icon,title,text);
    card.addEventListener("click",() => {
      const memoryIndex = memories.indexOf(photo);
      openPhotoViewer(memoryIndex,"memory");
    });

    grid.appendChild(card);
  });
}

/* INITIAL DISPLAY */

function refreshWebsite() {
  renderPhotos();
  renderHobbies();
  renderMemories();
}

refreshWebsite();
/* LOAD PHOTOS FROM SUPABASE */

async function loadPhotos() {
  console.log("LOAD PHOTOS STARTED");

  try {
    console.log("SUPABASE CLIENT:", !!supabaseClient);
    console.log("SUPABASE URL:", SUPABASE_URL);

    const { data, error } = await supabaseClient
      .storage
      .from("photos")
      .list("", {
        limit: 100,
        offset: 0,
        sortBy: {
          column: "name",
          order: "asc"
        }
      });

    console.log("STORAGE ERROR:", error);
    console.log("STORAGE DATA:", data);

    if (error) throw error;

    console.log("SUPABASE FILES:", data);
    console.log("FIRST FILE:", data?.[0]);

    const remotePhotos = (data || [])
      .filter(file =>
        file.name &&
        /\.(jpg|jpeg|png|webp)$/i.test(file.name)
      )
      .map(file => {
        const name = file.name;

        const match = name.match(
          /^(frame|memory|favourite)_{1,2}(\d+)_{1,2}(.+)\.(jpg|jpeg|png|webp)$/i
        );

        if (!match) return null;

        let title = match[3];

        try {
          title = decodeURIComponent(title);
        } catch (e) {}

        const { data: urlData } = supabaseClient
          .storage
          .from("photos")
          .getPublicUrl(name);

        return {
          id: name,
          category: match[1].toLowerCase(),
          title: title.replace(/_/g, " "),
          image: urlData.publicUrl
        };
      })
      .filter(Boolean)
      .reverse();

    // Keep existing local photos if Storage is empty
    photos = remotePhotos;
savePhotos();

    refreshWebsite();

    if (isAdmin) renderAdmin();

    console.log("LOADED PHOTOS:", photos);
    console.log("PHOTO COUNT:", photos.length);

  } catch (error) {
    console.error("PHOTO LOADING ERROR:", error);
  }
}

loadPhotos();
/* 
/* =====================================
   JIBON'S WORLD
   PART 2 - JAVASCRIPT
   BLOCK 2
===================================== */

/* AD=MIN ACCESS
   Default password: jibon123
   এটি শুধু Hidden Admin UI, শক্তশালী
   Security System নয়।
*/

function openAdmin() {
  $("adminOverlay").classList.remove("hidden");
  $("adminLogin").classList.remove("hidden");
  $("adminDashboard").classList.add("hidden");
  $("adminPassword").value = "";
  $("adminError").textContent = "";
}

$("adminTrigger").addEventListener("click",openAdmin);

$("brandLogo").addEventListener("click",() => {
  logoTaps++;

  clearTimeout(logoTapTimer);
  logoTapTimer = setTimeout(() => logoTaps = 0,1500);

  if (logoTaps >= 5) {
    logoTaps = 0;
    openAdmin();
  }
});

$("adminClose").addEventListener("click",() => {
  $("adminOverlay").classList.add("hidden");
});
/* SECURE ADMIN LOGIN */

$("adminLoginBtn").addEventListener("click", async () => {
  const websitePassword = $("adminPassword").value;
  const email = $("supabaseEmail").value.trim();
  const password = $("supabasePassword").value;

  $("adminError").textContent = "";

  if (websitePassword !== "meow") {
    $("adminError").textContent = "Incorrect website password!";
    return;
  }

  if (!email || !password) {
    $("adminError").textContent = "Enter Supabase email and password!";
    return;
  }

  const button = $("adminLoginBtn");
  button.disabled = true;
  button.textContent = "VERIFYING...";

  try {
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

    if (error) throw error;

    if (data.user.id !== "49ec1cc2-137f-4882-9c1c-df0b8ff948d5") {
      await supabaseClient.auth.signOut();
      throw new Error("You are not authorized!");
    }

    isAdmin = true;
    $("adminLogin").classList.add("hidden");
    $("adminDashboard").classList.remove("hidden");
    renderAdmin();

  } catch (error) {
    $("adminError").textContent = error.message;
  }

  button.disabled = false;
  button.textContent = "ENTER ADMIN";
});

/* ENTER KEY SUPPORT */

["adminPassword", "supabaseEmail", "supabasePassword"].forEach(id => {
  $(id).addEventListener("keydown", event => {
    if (event.key === "Enter") $("adminLoginBtn").click();
  });
});

/* ADMIN LOGOUT */

$("adminLogout").addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  isAdmin = false;
  $("adminOverlay").classList.add("hidden");
});

/* ADMIN PHOTO CATEGORY */

const favouriteOption = document.createElement("option");
favouriteOption.value = "favourite";
favouriteOption.textContent = "Favourite";
$("photoCategory").appendChild(favouriteOption);

/* IMAGE COMPRESSION */

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 1000;
        const scale = Math.min(
          1,
          maxSize / Math.max(image.width, image.height)
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        canvas.getContext("2d").drawImage(
          image, 0, 0, canvas.width, canvas.height
        );

        canvas.toBlob(blob => {
          if (blob) resolve(blob);
          else reject(new Error("Image compression failed"));
        }, "image/jpeg", 0.72);
      };

      image.onerror = reject;
      image.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
  /* ADD PHOTO TO SUPABASE */

$("addPhotoBtn").addEventListener("click", async () => {
  if (!isAdmin) return;

  const title = $("photoTitle").value.trim() || "My Photo";
  const file = $("photoFile").files[0];
  const category = $("photoCategory").value;

  if (!file) {
    alert("Please select a photo first.");
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please select an image file.");
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    alert("Please choose an image under 8 MB.");
    return;
  }

  const button = $("addPhotoBtn");
  button.disabled = true;
  button.textContent = "UPLOADING...";

  try {
    const imageBlob = await compressImage(file);

    const fileName =
      category + "__" + Date.now() + "__" +
      encodeURIComponent(title) + ".jpg";

    const { data, error } = await supabaseClient
   
      .storage
      .from("photos")
      .upload(fileName, imageBlob, {
        contentType: "image/jpeg",
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = supabaseClient
      .storage
      .from("photos")
      .getPublicUrl(data.path);

    const photo = {
      id: data.path,
      title: title,
      category: category,
      image: urlData.publicUrl
    };

    await loadPhotos();

    if (!photos.some(p => p.id === data.path)) {
      photos.unshift(photo);
      refreshWebsite();
    }

    renderAdmin();

    $("photoTitle").value = "";
    $("photoFile").value = "";

    alert("Photo uploaded successfully! 💜");

  } catch (error) {
    console.error("Upload error:", error);
    alert("Upload failed: " + error.message);
  } finally {
    button.disabled = false;
    button.textContent = "ADD PHOTO ＋";
  }
});
/* DELETE PHOTO FROM SUPABASE */

async function deletePhoto(id) {
  if (!isAdmin) return;

  if (!confirm("Delete this photo?")) return;

  try {
    const { error } = await supabaseClient
      .storage
      .from("photos")
      .remove([id]);

    if (error) throw error;

    photos = photos.filter(photo => photo.id !== id);

    refreshWebsite();
    renderAdmin();

    alert("Photo deleted successfully! 💜");

    await loadPhotos();

  } catch (error) {
    console.error("Delete error:", error);
    alert("Delete failed: " + error.message);
  }
}


/* ADD HOBBY */

$("addHobbyBtn").addEventListener("click",() => {
  if (!isAdmin) return;

  const name = $("hobbyName").value.trim();
  const description = $("hobbyDescription").value.trim();

  if (!name) {
    alert("Please enter a hobby name.");
    return;
  }

  hobbies.push({
    name:name,
    description:description || "One of my favourite hobbies",
    icon:"✨"
  });

  saveHobbies();
  renderHobbies();
  renderAdmin();

  $("hobbyName").value = "";
  $("hobbyDescription").value = "";

  alert("Hobby added! ✨");
});

/* DELETE HOBBY */

function deleteHobby(index) {
  if (!isAdmin) return;
  if (!confirm("Delete this hobby?")) return;

  hobbies.splice(index,1);
  saveHobbies();
  renderHobbies();
  renderAdmin();
}

/* ADMIN LISTS */

function renderAdmin() {
  if (!isAdmin) return;

  $("photoCount").textContent = photos.length;
  $("hobbyCount").textContent = hobbies.length;

  const photoList = $("adminPhotoList");
  photoList.replaceChildren();

  photos.forEach(photo => {
    const item = document.createElement("div");
    item.className = "admin-item";

    const name = document.createElement("span");
    name.textContent = photo.title;

    const button = document.createElement("button");
    button.textContent = "Delete";
    button.addEventListener("click",() => deletePhoto(photo.id));

    item.append(name,button);
    photoList.appendChild(item);
  });

  const hobbyList = $("adminHobbyList");
  hobbyList.replaceChildren();

  hobbies.forEach((hobby,index) => {
    const item = document.createElement("div");
    item.className = "admin-item";

    const name = document.createElement("span");
    name.textContent = hobby.name;

    const button = document.createElement("button");
    button.textContent = "Delete";
    button.addEventListener("click",() => deleteHobby(index));

    item.append(name,button);
    hobbyList.appendChild(item);
  });
}

/* MOVING STAR BACKGROUND */

const canvas = $("starCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let animationFrame;

function resizeStars() {
  canvas.width = window.innerWidth * Math.min(devicePixelRatio || 1,1.5);
  canvas.height = window.innerHeight * Math.min(devicePixelRatio || 1,1.5);

  const ratio = Math.min(devicePixelRatio || 1,1.5);
  ctx.setTransform(ratio,0,0,ratio,0,0);

  stars = Array.from({length:Math.min(90,Math.floor(window.innerWidth / 5))},() => ({
    x:Math.random() * window.innerWidth,
    y:Math.random() * window.innerHeight,
    size:Math.random() * 1.5 + .3,
    speed:Math.random() * .35 + .08,
    alpha:Math.random() * .8 + .2
  }));
}

function drawStars() {
  ctx.clearRect(0,0,window.innerWidth,window.innerHeight);

  stars.forEach(star => {
    star.y += star.speed;

    if (star.y > window.innerHeight) {
      star.y = 0;
      star.x = Math.random() * window.innerWidth;
    }

    star.alpha += (Math.random() - .5) * .035;
    star.alpha = Math.max(.15,Math.min(1,star.alpha));

    ctx.beginPath();
    ctx.arc(star.x,star.y,star.size,0,Math.PI * 2);
    ctx.fillStyle = `rgba(220,190,255,${star.alpha})`;
    ctx.fill();
  });

  animationFrame = requestAnimationFrame(drawStars);
}

resizeStars();
drawStars();

window.addEventListener("resize",resizeStars);


/* 3D PHOTO CARD TILT */

document.addEventListener("mousemove",event => {
  if (!window.matchMedia("(pointer:fine)").matches) return;

  const card = event.target.closest(".photo-card");
  if (!card) return;

  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  card.style.transform =
    `perspective(700px) rotateX(${(0.5-y)*9}deg) rotateY(${(x-0.5)*9}deg) scale(1.025)`;
});

document.addEventListener("mouseout",event => {
  const card = event.target.closest(".photo-card");
  if (card && !card.contains(event.relatedTarget)) {
    card.style.transform = "";
  }
});

/* CLICK RIPPLE */

document.addEventListener("click",event => {
  const button = event.target.closest("button");
  if (!button) return;

  const ripple = document.createElement("span");
  ripple.style.cssText = `
    position:absolute;
    width:12px;height:12px;
    border-radius:50%;
    background:rgba(220,180,255,.35);
    pointer-events:none;
    transform:translate(-50%,-50%) scale(1);
    animation:rippleOut .55s ease-out forwards;
  `;

  if (getComputedStyle(button).position === "static") {
    button.style.position = "relative";
  }

  button.style.overflow = "hidden";
  const rect = button.getBoundingClientRect();

  ripple.style.left = (event.clientX - rect.left) + "px";
  ripple.style.top = (event.clientY - rect.top) + "px";

  button.appendChild(ripple);
  setTimeout(() => ripple.remove(),600);
});

/* FINISH */

document.addEventListener("visibilitychange",() => {
  if (document.hidden) {
    cancelAnimationFrame(animationFrame);
  } else {
    cancelAnimationFrame(animationFrame);
    drawStars();
  }
});

console.log("JIBON'S WORLD is ready! 💜");

/* ===== JIBON'S WORLD INTERACTION FX ===== */

// 1. NEON TRAIL
let lastTrail = 0;

document.addEventListener("pointermove", (e) => {
  const now = Date.now();
  if (now - lastTrail < 35) return;
  lastTrail = now;

  const dot = document.createElement("div");
  dot.className = "neon-trail";
  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";

  document.body.appendChild(dot);
  setTimeout(() => dot.remove(), 700);
});

// 2. ENERGY SHOCKWAVE
document.addEventListener("pointerdown", (e) => {
  const wave = document.createElement("div");
  wave.className = "energy-wave";
  wave.style.left = e.clientX + "px";
  wave.style.top = e.clientY + "px";

  document.body.appendChild(wave);
  setTimeout(() => wave.remove(), 850);
});

// 3. INTERACTIVE STAR NETWORK
const networkCanvas = document.createElement("canvas");
networkCanvas.id = "networkCanvas";
document.body.prepend(networkCanvas);

const networkCtx = networkCanvas.getContext("2d");
let networkStars = [];
let networkPointer = { x: -1000, y: -1000 };

function setupNetwork() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  networkCanvas.width = innerWidth * dpr;
  networkCanvas.height = innerHeight * dpr;

  networkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = innerWidth < 600 ? 28 : 48;

  networkStars = Array.from({ length: count }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .35,
    vy: (Math.random() - .5) * .35
  }));
}

function animateNetwork() {
  networkCtx.clearRect(0, 0, innerWidth, innerHeight);

  networkStars.forEach((star, i) => {
    star.x += star.vx;
    star.y += star.vy;

    if (star.x < 0 || star.x > innerWidth) star.vx *= -1;
    if (star.y < 0 || star.y > innerHeight) star.vy *= -1;

    networkCtx.beginPath();
    networkCtx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
    networkCtx.fillStyle = "#c4a1ff";
    networkCtx.fill();

    networkStars.slice(i + 1).forEach(other => {
      const dx = star.x - other.x;
      const dy = star.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 115) {
        networkCtx.beginPath();
        networkCtx.moveTo(star.x, star.y);
        networkCtx.lineTo(other.x, other.y);
        networkCtx.strokeStyle =
          `rgba(170,120,255,${(1 - distance / 115) * .35})`;
        networkCtx.lineWidth = 1;
        networkCtx.stroke();
      }
    });

    const px = star.x - networkPointer.x;
    const py = star.y - networkPointer.y;

    if (Math.hypot(px, py) < 125) {
      networkCtx.beginPath();
      networkCtx.moveTo(star.x, star.y);
      networkCtx.lineTo(networkPointer.x, networkPointer.y);
      networkCtx.strokeStyle = "rgba(190,140,255,.45)";
      networkCtx.stroke();
    }
  });

  requestAnimationFrame(animateNetwork);
}

document.addEventListener("pointermove", e => {
  networkPointer.x = e.clientX;
  networkPointer.y = e.clientY;
});

document.addEventListener("pointerleave", () => {
  networkPointer.x = -1000;
  networkPointer.y = -1000;
});

setupNetwork();
// animateNetwork();

window.addEventListener("resize", setupNetwork);
/* 3D GALLERY TOUCH INTERACTION */

document.addEventListener("pointerdown", (e) => {
  const card = e.target.closest("#photoGrid .photo-card");
  if (!card) return;

  card.classList.add("gallery-touch");

  setTimeout(() => {
    card.classList.remove("gallery-touch");
  }, 650);
});
/* 3D PROFILE CARD MOVEMENT */

const profile3D = $("profile3D");

if (profile3D) {

  function resetProfile() {
    profile3D.style.transform =
      "rotateX(0deg) rotateY(0deg)";
  }

  function moveProfile(x, y) {
    const rect = profile3D.getBoundingClientRect();

    const px = (x - rect.left) / rect.width;
    const py = (y - rect.top) / rect.height;

    const rotateY = (px - 0.5) * 18;
    const rotateX = (0.5 - py) * 18;

    profile3D.style.transform =
      `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  profile3D.addEventListener("pointermove", e => {
    if (e.pointerType === "touch") return;
    moveProfile(e.clientX, e.clientY);
  });

  profile3D.addEventListener("pointerleave", resetProfile);
    profile3D.addEventListener("touchmove", e => {
    const touch = e.touches[0];
    if (!touch) return;

    moveProfile(touch.clientX, touch.clientY);
  }, { passive: true });

  profile3D.addEventListener("touchend", resetProfile);
}


/* CINEMATIC PAGE TRANSITION */

const originalShowPage = showPage;

showPage = function(pageName) {

  const currentPage = document.querySelector(".page.active");

  if (!currentPage) {
    originalShowPage(pageName);
    return;
  }

  if (currentPage.id === "page-" + pageName) return;

  currentPage.classList.add("cinematic-exit");

  setTimeout(() => {
    currentPage.classList.remove("cinematic-exit");
    originalShowPage(pageName);
  }, 300);

};
/* SECRET SURPRISE SYSTEM */

const secretBtn = $("secretBtn");
const secretMessage = $("secretMessage");

function sparkleBurst(button) {
  const box = button.parentElement;
  const cx = button.offsetLeft + button.offsetWidth / 2;
  const cy = button.offsetTop + button.offsetHeight / 2;

  for (let i = 0; i < 16; i++) {
    const spark = document.createElement("span");
    spark.className = "sparkle";

    const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
    const distance = 60 + Math.random() * 60;

    spark.style.left = cx + "px";
    spark.style.top = cy + "px";
    spark.style.setProperty("--dx", Math.cos(angle) * distance + "px");
    spark.style.setProperty("--dy", Math.sin(angle) * distance + "px");

    box.appendChild(spark);
    setTimeout(() => spark.remove(), 900);
  }
}

if (secretBtn && secretMessage) {
  secretBtn.addEventListener("click", () => {
    const isOpen = secretMessage.classList.toggle("show");

    secretBtn.classList.toggle("open", isOpen);
    secretBtn.textContent = isOpen ? "Close information" : "More Information";

    sparkleBurst(secretBtn);

    if (isOpen) {
      setTimeout(() => {
        secretMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 350);
    }
  });
}
/* PHOTO LIQUID LIGHT */

const profileAvatar = document.querySelector(".profile-avatar");

if (profileAvatar) {
  profileAvatar.addEventListener("pointermove", e => {
    const rect = profileAvatar.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    profileAvatar.style.setProperty("--light-x", x + "%");
    profileAvatar.style.setProperty("--light-y", y + "%");
  });
}
/* DIMENSION SWITCH SYSTEM */

const dimensionBtn = $("dimensionBtn");
const portalWarp = $("portalWarp");

let alternateDimension = false;

if (dimensionBtn && portalWarp) {

  dimensionBtn.addEventListener("click", () => {

    portalWarp.classList.remove("active");
    void portalWarp.offsetWidth;
    portalWarp.classList.add("active");

    setTimeout(() => {

      alternateDimension = !alternateDimension;

      document.body.classList.toggle(
        "alternate-dimension",
        alternateDimension
      );

      dimensionBtn.innerHTML = alternateDimension
        ? "✦ RETURN TO ORIGINAL"
        : "◈ SWITCH DIMENSION";

    }, 300);

    setTimeout(() => {
      portalWarp.classList.remove("active");
    }, 700);

  });

}
/* MOBILE PERFORMANCE MODE */

const isMobile = window.matchMedia("(max-width: 650px)").matches;

if (isMobile) {
  document.documentElement.classList.add("mobile-smooth");
}
/* COUNTDOWN */
let cdConfig = { title: "Birthday", month: 12, day: 25 };

function updateCountdown() {
  if (!$("cdDays")) return;

  const now = new Date();
  const { month, day } = cdConfig;

  if (now.getMonth() === month - 1 && now.getDate() === day) {
    $("cdTitle").textContent = "✦ IT'S TODAY! ✦";
    ["cdDays", "cdHours", "cdMinutes", "cdSeconds"].forEach(id => {
      $(id).textContent = "00";
    });
    return;
  }

  let target = new Date(now.getFullYear(), month - 1, day);
  if (target <= now) {
    target = new Date(now.getFullYear() + 1, month - 1, day);
  }

  const diff = target - now;
  const pad = n => String(n).padStart(2, "0");

  $("cdTitle").textContent = `✦ ${cdConfig.title.toUpperCase()} IN ✦`;
  $("cdDays").textContent = pad(Math.floor(diff / 86400000));
  $("cdHours").textContent = pad(Math.floor(diff / 3600000) % 24);
  $("cdMinutes").textContent = pad(Math.floor(diff / 60000) % 60);
  $("cdSeconds").textContent = pad(Math.floor(diff / 1000) % 60);
}

async function loadCountdown() {
  try {
    const { data, error } = await supabaseClient
      .from("site_settings")
      .select("value")
      .eq("key", "countdown")
      .maybeSingle();

    if (error) throw error;

    if (data && data.value) {
      const saved = JSON.parse(data.value);
      if (saved.month >= 1 && saved.month <= 12 && saved.day >= 1 && saved.day <= 31) {
        cdConfig = {
          title: saved.title || cdConfig.title,
          month: saved.month,
          day: saved.day
        };
      }
    }
  } catch (error) {
    console.error("Countdown load error:", error);
  }

  updateCountdown();
}

const saveCountdownBtn = $("saveCountdownBtn");

if (saveCountdownBtn) {
  saveCountdownBtn.addEventListener("click", async () => {
    if (!isAdmin) return;

    const title = $("countdownTitleInput").value.trim() || "Birthday";
    const dateValue = $("countdownDateInput").value;

    if (!dateValue) {
      alert("Please pick a date.");
      return;
    }

    const [, month, day] = dateValue.split("-").map(Number);

    saveCountdownBtn.disabled = true;
    saveCountdownBtn.textContent = "SAVING...";

    try {
      const { error } = await supabaseClient
        .from("site_settings")
        .upsert({ key: "countdown", value: JSON.stringify({ title, month, day }) });

      if (error) throw error;

      cdConfig = { title, month, day };
      updateCountdown();
      alert("Countdown saved! ⏳");
    } catch (error) {
      console.error("Countdown save error:", error);
      alert("Save failed: " + error.message);
    } finally {
      saveCountdownBtn.disabled = false;
      saveCountdownBtn.textContent = "SAVE COUNTDOWN";
    }
  });
}

updateCountdown();
loadCountdown();
setInterval(updateCountdown, 1000);
/* PERFORMANCE MODE */
const lowPower =
  window.matchMedia("(max-width: 650px), (pointer: coarse)").matches ||
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

if (lowPower) {
  document.documentElement.classList.add("perf-lite");
  animateNetwork = function () {};
  networkCanvas.style.display = "none";
}
/* LIGHT SCROLL REVEAL */
if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document
    .querySelectorAll(".countdown, .status-board, .visitor-box, .potd, .wish-box, .theme-switch, .secret-box")
    .forEach(element => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
}
/* STAR CATCHER GAME */
(function () {
  const overlay = $("gameOverlay");
  const canvas = $("gameCanvas");
  if (!overlay || !canvas) return;

  const gctx = canvas.getContext("2d");
  const BEST_KEY = "jibonWorldStarBest";
  const GAME_TIME = 30;

  let w = 0, h = 0;
  let items = [], particles = [];
  let score = 0, streak = 0, timeLeft = GAME_TIME, elapsed = 0;
  let running = false, rafId = 0, lastTime = 0, spawnAcc = 0;
  let best = 0;
  let hudScore = "", hudTime = "", hudStreak = "";

  try { best = Number(localStorage.getItem(BEST_KEY)) || 0; } catch (e) {}

  function showBest() {
    $("gameBest").textContent = "Best: " + best;
  }

  function showIntro() {
    $("gamePanelTitle").textContent = "STAR CATCHER ✦";
    $("gamePanelText").textContent =
      "Tap the falling stars for 30 seconds. Golden stars give 5 points. " +
      "Dark comets take points away!";
    $("gameStart").textContent = "START";
    $("gamePanel").classList.remove("hidden");
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function updateHud(force) {
    const s = "Score " + score;
    const t = Math.ceil(timeLeft) + "s";
    const k = streak >= 2 ? "x" + streak + " combo" : "";

    if (force || s !== hudScore) { $("gameScore").textContent = s; hudScore = s; }
    if (force || t !== hudTime) { $("gameTime").textContent = t; hudTime = t; }
    if (force || k !== hudStreak) { $("gameStreak").textContent = k; hudStreak = k; }
  }

  function spawn() {
    const roll = Math.random();
    let type = "star";

    if (roll > 0.92) type = "gold";
    else if (roll < 0.14 && elapsed > 3) type = "comet";

    const r = type === "gold" ? 15 : type === "comet" ? 17 : 12 + Math.random() * 8;

    items.push({
      type: type,
      r: r,
      x: r + Math.random() * (w - r * 2),
      y: -r,
      vy: (90 + Math.random() * 50 + elapsed * 4) * (type === "gold" ? 1.5 : 1),
      spin: Math.random() * Math.PI,
      rot: (Math.random() - .5) * 2
    });
  }

  function burst(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 120;

      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: color
      });
    }
  }

  function hit(x, y) {
    let index = -1;
    let nearest = Infinity;

    items.forEach((item, i) => {
      const d = Math.hypot(item.x - x, item.y - y);
      if (d < item.r + 16 && d < nearest) {
        nearest = d;
        index = i;
      }
    });

    if (index < 0) {
      streak = 0;
      return;
    }

    const item = items.splice(index, 1)[0];

    if (item.type === "comet") {
      score = Math.max(0, score - 3);
      streak = 0;
      burst(item.x, item.y, "#f87171");
      if (navigator.vibrate) navigator.vibrate(40);
    } else {
      streak++;
      const base = item.type === "gold" ? 5 : 1;
      const bonus = streak >= 5 ? 1 : 0;
      score += base + bonus;
      burst(item.x, item.y, item.type === "gold" ? "#fde68a" : "#e9d5ff");
      if (navigator.vibrate) navigator.vibrate(8);
    }

    updateHud();
  }

  function starPath(x, y, r, rot) {
    gctx.beginPath();

    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? r : r * 0.45;
      const angle = rot + (Math.PI / 5) * i - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;

      if (i === 0) gctx.moveTo(px, py);
      else gctx.lineTo(px, py);
    }

    gctx.closePath();
  }

  function draw() {
    gctx.clearRect(0, 0, w, h);

    items.forEach(item => {
      if (item.type === "comet") {
        gctx.beginPath();
        gctx.moveTo(item.x, item.y - item.r * 2.4);
        gctx.lineTo(item.x - item.r * 0.7, item.y);
        gctx.lineTo(item.x + item.r * 0.7, item.y);
        gctx.closePath();
        gctx.fillStyle = "rgba(248,113,113,.25)";
        gctx.fill();

        gctx.beginPath();
        gctx.arc(item.x, item.y, item.r * 0.8, 0, Math.PI * 2);
        gctx.fillStyle = "#3b0d1a";
        gctx.fill();
        gctx.lineWidth = 2;
        gctx.strokeStyle = "#f87171";
        gctx.stroke();
        return;
      }

      const gold = item.type === "gold";

      starPath(item.x, item.y, item.r * 1.6, item.spin);
      gctx.fillStyle = gold ? "rgba(253,230,138,.22)" : "rgba(192,132,252,.2)";
      gctx.fill();

      starPath(item.x, item.y, item.r, item.spin);
      gctx.fillStyle = gold ? "#fde68a" : "#e9d5ff";
      gctx.fill();
    });

    particles.forEach(p => {
      gctx.globalAlpha = Math.max(0, p.life);
      gctx.beginPath();
      gctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      gctx.fillStyle = p.color;
      gctx.fill();
    });

    gctx.globalAlpha = 1;
  }

  function frame(now) {
    if (!running) return;

    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    elapsed += dt;
    timeLeft = Math.max(0, GAME_TIME - elapsed);
    spawnAcc += dt;

    const interval = Math.max(0.28, 0.6 - elapsed * 0.01);

    if (spawnAcc >= interval) {
      spawnAcc = 0;
      spawn();
    }

    items.forEach(item => {
      item.y += item.vy * dt;
      item.spin += item.rot * dt;
    });

    items = items.filter(item => {
      if (item.y > h + item.r) {
        if (item.type !== "comet") streak = 0;
        return false;
      }
      return true;
    });

    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.life -= dt * 1.8;
    });

    particles = particles.filter(p => p.life > 0);

    draw();
    updateHud();

    if (timeLeft <= 0) {
      endGame();
      return;
    }

    rafId = requestAnimationFrame(frame);
  }

  function startGame() {
    resize();

    items = [];
    particles = [];
    score = 0;
    streak = 0;
    elapsed = 0;
    timeLeft = GAME_TIME;
    spawnAcc = 0;

    $("gamePanel").classList.add("hidden");
    updateHud(true);

    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function endGame() {
    running = false;
    cancelAnimationFrame(rafId);
    draw();

    const isBest = score > best;

    if (isBest) {
      best = score;
      try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) {}
    }

    showBest();

    $("gamePanelTitle").textContent = isBest && score > 0 ? "NEW BEST! ✦" : "TIME'S UP ✦";
    $("gamePanelText").textContent = "You scored " + score + " points. Best: " + best + ".";
    $("gameStart").textContent = "PLAY AGAIN";
    $("gamePanel").classList.remove("hidden");
  }

  function openGame() {
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    resize();
    items = [];
    particles = [];
    gctx.clearRect(0, 0, w, h);
    score = 0;
    streak = 0;
    timeLeft = GAME_TIME;
    updateHud(true);
    showIntro();
  }

  function closeGame() {
    running = false;
    cancelAnimationFrame(rafId);
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  ["pointerdown", "pointermove", "mousedown", "mousemove", "click"].forEach(type => {
    overlay.addEventListener(type, event => event.stopPropagation());
  });

  ["touchstart", "touchmove"].forEach(type => {
    overlay.addEventListener(type, event => event.stopPropagation(), { passive: true });
  });

  $("gamePlayBtn").addEventListener("click", openGame);
  $("gameStart").addEventListener("click", startGame);
  $("gameClose").addEventListener("click", closeGame);

  let lastTap = { x: -99, y: -99, t: 0 };

function handleTap(clientX, clientY) {
  if (!running) return;

  const now = Date.now();
  if (
    now - lastTap.t < 60 &&
    Math.hypot(clientX - lastTap.x, clientY - lastTap.y) < 8
  ) return;

  lastTap = { x: clientX, y: clientY, t: now };

  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) * (w / rect.width);
  const y = (clientY - rect.top) * (h / rect.height);

  burst(x, y, "#8b7bb8");
  hit(x, y);
}

canvas.addEventListener("pointerdown", event => {
  handleTap(event.clientX, event.clientY);
});

canvas.addEventListener("touchstart", event => {
  const touch = event.changedTouches[0];
  handleTap(touch.clientX, touch.clientY);
}, { passive: true });

canvas.addEventListener("mousedown", event => {
  handleTap(event.clientX, event.clientY);
});

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !overlay.classList.contains("hidden")) closeGame();
  });

  window.addEventListener("resize", () => {
    if (!overlay.classList.contains("hidden")) resize();
  });

  showBest();
})();
  /* GAME ANIMATIONS (wrappers) */
  let floaters = [];

  function bump(el) {
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }

  function shake() {
    overlay.classList.remove("shake");
    void overlay.offsetWidth;
    overlay.classList.add("shake");
  }

  const baseHit = hit;

  hit = function (x, y) {
    const scoreBefore = score;
    const countBefore = items.length;

    baseHit(x, y);

    if (items.length < countBefore) {
      const diff = score - scoreBefore;
      const bad = diff <= 0;

      floaters.push({
        x: x,
        y: y,
        text: bad ? "-3" : "+" + diff,
        color: bad ? "#f87171" : diff >= 5 ? "#fde68a" : "#e9d5ff",
        born: performance.now()
      });

      if (bad) shake();
    }
  };

  const baseDraw = draw;

  draw = function () {
    baseDraw();

    const now = performance.now();
    floaters = floaters.filter(f => now - f.born < 900);

    floaters.forEach(f => {
      const age = (now - f.born) / 900;

      gctx.globalAlpha = 1 - age;
      gctx.font = "700 20px Poppins, sans-serif";
      gctx.textAlign = "center";
      gctx.fillStyle = f.color;
      gctx.fillText(f.text, f.x, f.y - age * 45);
    });

    gctx.globalAlpha = 1;
  };

  const baseUpdateHud = updateHud;

  updateHud = function (force) {
    const prevScore = hudScore;
    const prevStreak = hudStreak;

    baseUpdateHud(force);

    if (!force && hudScore !== prevScore) bump($("gameScore"));
    if (!force && hudStreak !== prevStreak && hudStreak) bump($("gameStreak"));

    $("gameTime").classList.toggle("low", running && timeLeft <= 5);
  };
/* COUNTDOWN SECOND TICK */
setInterval(() => {
  const el = $("cdSeconds");
  if (!el) return;

  el.classList.remove("tick");
  void el.offsetWidth;
  el.classList.add("tick");
}, 1000);