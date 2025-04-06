// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 50,
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }
});

document.getElementById("search-button").addEventListener("click", function() {
    let query = document.getElementById("search-input").value.toLowerCase();
    
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".cta-button");
    const icon = button.querySelector(".icon");

    button.addEventListener("click", function () {
        icon.style.opacity = "1";
        icon.style.transform = "translateX(20px)";

        // 1 सेकंड बाद आइकन गायब हो जाएगा
        setTimeout(() => {
            icon.style.opacity = "0";
            icon.style.transform = "translateX(100px)"; // और ज्यादा स्लाइड करेगा
        }, 1000);
    });
});

function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

document.addEventListener("click", function (event) {
    let navLinks = document.querySelector(".nav-links");
    let hamburger = document.querySelector(".hamburger-menu");
    let ctaButton =document.querySelector(".cta-button");

if (window.innerWidth <= 768) {
    if (!navLinks.contains(event.target) && !hamburger.contains(event.target) && !ctaButton.contains(event.target)) {
        navLinks.classList.remove("active");

        // 300ms बाद display: none करने के लिए
        setTimeout(() => {
            navLinks.style.display = "none";
        }, 300);
      }
    }
});

// जब स्क्रीन resize हो, तो चेक करें कि यह PC मोड में है या नहीं
window.addEventListener("resize", function () {
    let navLinks = document.querySelector(".nav-links");

    if (window.innerWidth > 768) {
        navLinks.style.display = "flex"; // PC मोड में हमेशा दिखाओ
    } else {
        navLinks.style.display = "none"; // मोबाइल मोड में छिपा रह सकता है
    }
});

function toggleMenu() {
    let navLinks = document.querySelector(".nav-links");
   
    if (navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
       
        setTimeout(() => {
            navLinks.style.display = "none";
        }, 300);
    } else {
        navLinks.style.display = "flex";
        setTimeout(() => {
            navLinks.classList.add("active");
        }, 10);
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
         navbar.style.backgroundColor = "rgba(10, 10, 10, 0.98)";
    } else {
         navbar.style.backgroundColor = "rgba(10, 10, 10, 0.95)";
    }
});

// Select the Earth container
const container = document.getElementById('earth-container');

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Add a Sphere (Earth)
const geometry = new THREE.SphereGeometry(1, 32, 32);
const texture = new THREE.TextureLoader().load('images/earth-texture.jpg'); // Add your Earth texture image here
const material = new THREE.MeshStandardMaterial({ map: texture });
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Add Light
const light = new THREE.PointLight(0xffffff, 3);
light.position.set(5, 5, 5);
scene.add(light);

// Camera Position
camera.position.z = 3;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.01; // Rotate the Earth
    renderer.render(scene, camera);
}
animate();

// Make the Earth Responsive
window.addEventListener('resize', () => {
    // Update camera aspect ratio and renderer size
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
});

const glowShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        viewVector: { type: "v3", value: camera.position },
        c: { type: "f", value: 0.5 },
        p: { type: "f", value: 6.0 },
        glowColor: { type: "c", value: new THREE.Color(0x00ffff) },
    },
    vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormView = normalize(viewVector - modelViewMatrix * vec4(position, 1.0)).xyz;
            intensity = pow(c - dot(vNormal, vNormView), p);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
            gl_FragColor = vec4(glowColor * intensity, 1.0);
        }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
});

const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32); // Slightly larger than the Earth
const glow = new THREE.Mesh(glowGeometry, glowShaderMaterial);
scene.add(glow);

document.addEventListener("DOMContentLoaded", () => {
    function loadContent(url) {
        const mainContent = document.getElementById('main-content'); // Container for hero, product, and trip sections

        if (!mainContent) {
            console.error("Error: #main-content element not found in the DOM.");
            return;
        }

        // Reset the scroll position to the top
        window.scrollTo({ top: 0, behavior: 'auto' });

        // Fetch the new content
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then((html) => {
                // Replace the content of #main-content
                mainContent.innerHTML = html;

                // Dynamically load the CSS file for the loaded page
                const existingLink = document.getElementById('dynamic-css');
                if (existingLink) {
                    existingLink.remove(); // Remove the existing CSS file
                }

                const link = document.createElement('link');
                link.id = 'dynamic-css';
                link.rel = 'stylesheet';
                if (url.includes('ledbulb.html')) {
                    link.href = 'product/ledbulb.css'; // Path to the CSS file for LED Bulbs
                }
                if (url.includes('streetlight.html')) {
                    link.href = 'product/streetlight.css'; // Path to the CSS file for streetlights
                }
                if (url.includes('panellight.html')) {
                    link.href = 'product/panellight.css'; // Path to the CSS file for panel lights
                }
                if (url.includes('decorativelight.html')) {
                    link.href = 'product/decorativelight.css'; // Path to the CSS file for decorative lights
                }
                // Add more conditions for other pages if needed

                document.head.appendChild(link);
            })
            .catch((error) => {
                console.error('Error loading content:', error);
                mainContent.innerHTML = '<p>Failed to load content. Please try again later.</p>';
            });
    }

    // Expose the loadContent function globally
    window.loadContent = loadContent;
});
