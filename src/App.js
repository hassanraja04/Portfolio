import React, { useEffect, useState, useRef, useCallback} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import cropCastImage from './images/cropcast.jpeg';
import YoutubeImage from './images/eyestetix-studio-LskCjwwJBEQ-unsplash.jpg';
import PortfolioImage from './images/emile-perron-xrVDYZRGdw4-unsplash.jpg';

function App() {
  const [text, setText] = useState('');
  const fullText = "Haassan Raja";
  const [typingFinished, setTypingFinished] = useState(false);

  // Typing Effect
  useEffect(() => {
    let index = 0;
    let intervalId;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index < fullText.length) {
          setText(prev => prev + fullText.charAt(index));
          index++;
        } else {
          clearInterval(intervalId);
          setTypingFinished(true); 
        }
      }, 90); // Change typing speed
    }, 850); // Delay before typing starts

    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
}, [fullText]);

  useEffect(() => {
    AOS.init({
      
      duration: 1000,  
      once: true, 
      disable: 'mobile'
    });
  }, []);
  
  //  Glow effect
  const blob = document.getElementById("blob");
  window.onpointermove = event => {
    if (blob) {
      const { clientX, clientY } = event;
      blob.style.left = `${clientX}px`;
      blob.style.top = `${clientY}px`;
    }
  };

  // Scrambled Text effect
  useEffect(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let intervals = [];

    const h2Elements = document.querySelectorAll("h2");

    const handleMouseOver = event => {
        let iteration = 0;
        let interval = setInterval(() => {
            event.target.innerText = event.target.innerText
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return event.target.dataset.value[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iteration >= event.target.dataset.value.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 20);

        intervals.push(interval);  
    };

    h2Elements.forEach(h2 => {
        h2.addEventListener('mouseover', handleMouseOver);
    });

    
    return () => {
        h2Elements.forEach(h2 => {
            h2.removeEventListener('mouseover', handleMouseOver);
        });
        intervals.forEach(clearInterval); 
    };
}, []);
    
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [translateX, setTranslateX] = useState(0);
  const trackRef = useRef(null);

  //Sliding Parallax effect in Projects section
  const getPointerPosition = (e) => {
    if (e.touches) {
      return e.touches[0].clientX;
    } else {
      return e.clientX;
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!trackRef.current.dataset.isDragging) return;
  
    const clientX = getPointerPosition(e);
    const mouseDelta = clientX - parseFloat(trackRef.current.dataset.mouseDownAt);
    const percentageFactor = 5;
    let nextPercentageUnconstrained = parseFloat(trackRef.current.dataset.startScrollLeft) + (mouseDelta / (window.innerWidth / 2)) * -100 * percentageFactor;
  
    const maxScrollRight = 100;
    const maxScrollLeft = -(trackRef.current.scrollWidth - trackRef.current.clientWidth);
    nextPercentageUnconstrained = Math.min(Math.max(nextPercentageUnconstrained, maxScrollLeft), maxScrollRight);
  
    setTranslateX(nextPercentageUnconstrained);
  
    const images = trackRef.current.getElementsByClassName('image');
    Array.from(images).forEach(image => {
      const maxImageTranslate = 150;
      const imageShiftPercentage = (nextPercentageUnconstrained / window.innerWidth) * maxImageTranslate;
      image.style.objectPosition = `calc(50% + ${imageShiftPercentage}%) center`;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);
  

  const handleMouseUp = useCallback((e) => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('touchend', handleMouseUp);

    if (trackRef.current) {
      trackRef.current.dataset.isDragging = false;
      trackRef.current.dataset.mouseDownAt = "0";
      trackRef.current.dataset.startScrollLeft = "0";
    }
  }, [handleMouseMove]);

  const handleMouseDown = useCallback((e) => {
    if (!isExpanded && trackRef.current) {
      trackRef.current.dataset.isDragging = true;
      const mouseDownAt = getPointerPosition(e);
      trackRef.current.dataset.mouseDownAt = mouseDownAt.toString();
      trackRef.current.dataset.startScrollLeft = translateX.toString();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);
    }
  }, [isExpanded, translateX, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const projectsContainer = document.getElementById('outer-container');
    if (projectsContainer) {
      projectsContainer.addEventListener('mousedown', handleMouseDown);
      projectsContainer.addEventListener('touchstart', handleMouseDown);
      
      return () => {
        projectsContainer.removeEventListener('mousedown', handleMouseDown);
        projectsContainer.removeEventListener('touchstart', handleMouseDown);
      };
    }
  }, [handleMouseDown]);

  

  const projects = [
    {
      title: "CropCast",
      description: "Developed for a university assignment, CropCast is a weather application designed specifically for farmers. It uses data from the OpenWeather API to provide personalized forecasts and advice tailored to the specific needs of farmers, focusing on their location and crop types",
      imgSrc: cropCastImage,
      technologies: ["HTML5", "CSS3", "JavaScript", "ReactJS", "Git"],
      liveDemo: "https://master--bespoke-medovik-5fccf5.netlify.app",
      sourceUrl: "https://github.com/hassanraja04/CropCast"
    },
    {
      title: "Youtube To MP3 Converter",
      description: "Developed a Python script to convert video links into audio files, tailored specifically for personal use",
      imgSrc: YoutubeImage,
      technologies: ["Python"],
      sourceUrl: "https://github.com/hassanraja04/YouTube-To-mp3-converter"
    },
    {
      title: "Portfolio",
      description: "This page! Responsive website built with ReactJS. Also contains some cool features which can only be found using a mouse",
      imgSrc: PortfolioImage,
      technologies: ["HTML5", "CSS3", "JavaScript", "ReactJS"],
      liveDemo: "https://master--hassnraja.netlify.app",
      sourceUrl: "https://github.com/hassanraja04/Portfolio"
    }
  ];

  const [activeProject, setActiveProject] = useState(null);
  const detailOverlayRef = useRef(null);

  const handleImageClick = (project) => {
    setActiveProject(project);  
    setActiveImage(project.imgSrc);  
    setIsExpanded(true);  
    if (detailOverlayRef.current) {
      detailOverlayRef.current.classList.add('active');
    }
  };

  const handleBackClick = () => {
    setIsExpanded(false);
    setActiveImage(null);
    setActiveProject(null);
    setTranslateX(0); 
    if (detailOverlayRef.current) {
      detailOverlayRef.current.classList.remove('active');
    }
    
  };
  useEffect(() => {
    if (window.AOS && isExpanded) {
      AOS.refresh();
    }
  }, [isExpanded]);
  const [currentYear] = useState(new Date().getFullYear());

  
  return (
    <div className="body">
      <div id="blob"></div>
      <div id="blur"></div>
      <header className="navbar-container">
        <nav className='navbar' data-aos="fade-down" data-aos-delay="200">
          <a href="#Projects">
            <h2 data-value="PROJECTS">PROJECTS</h2>
          </a>
          <a href="#Contact">
            <h2 data-value="CONTACT">CONTACT</h2>
          </a>
        </nav>
      </header>
      <div className='main-container'>
        <div class='title'>
          <span id="typed-text">{text}</span><span className={`caret ${typingFinished ? 'blink' : ''}`}></span>
        </div>
        <div className='description' data-aos="fade-in" data-aos-delay="300">
        I'm an aspiring software engineer in my final year at Queen Mary, University of London.
          Check out my <a href='#Projects' className='different'>side-projects</a> below.
        </div>
      </div>
      <div id="terminal" className='terminal-slide-up'>
        <div class="terminal-header">
          <div class="button-container">
            <span class="button close"></span>
            <span class="button minimize"></span>
            <span class="button maximize"></span>
          </div>
        </div>
        <div class="terminal-body">
          <div class="command">&gt; Hassan.currentLocation</div>
          <div class="output">"London, UK"</div>

          <div class="command">&gt; Hassan.contactInfo</div>
          <div class="output">
          [
          "<a href='mailto:hassanrajam123@gmail.com' rel='noreferrer'>hassanrajam123@gmail.com</a>", 
          "<a href='https://www.linkedin.com/in/hassan-raja-24b503259' target='_blank' rel='noreferrer'>LinkedIn</a>", 
          "<a href='https://github.com/hassanraja04' target='_blank' rel='noreferrer'>GitHub</a>"
          ]
          </div>

          <div class="command">&gt; Hassan.resume</div>
          <div class="output">
            <a href='/CV.pdf' target='_blank' rel='noopener noreferrer'>CV.pdf</a>
          </div>

          <div class="command">&gt; Hassan.interests</div>
          <div class="output">["piano", "rugby", "gym"]</div>

          <div class="command">&gt; Hassan.education</div>
          <div class="output">"B.Sc. Computer Science - Queen Mary University of London"</div>

          <div class="command">&gt; Hassan.skills</div>
          <div class="output">["Java", "JavaScript", "Python", "React", "HTML/CSS", "Linux", "swing", "git"]</div>

          <div class="last-line">
            <span class="command">&gt; </span>
            <span className='effect'></span>
          </div>
        </div>
      </div>
      <div className="Projects" id='Projects'>
        <div className="header-wrapper">
          <h2 className="project-header" data-value="PROJECTS" data-aos="fade-up">PROJECTS</h2>
        </div>
        <div id="outer-container" onMouseDown={handleMouseDown} data-aos="fade-up" data-aos-delay= "100">
          <div className="project-card-wrapper" id='project-card-wrapper' data-mouse-down-at="0" data-prev-percentage="0" ref={trackRef} style={{
            transform: isExpanded ? 'none' : `translate3d(${translateX}px, 0px, 0px)`,
            transition: isExpanded ? 'none' : 'transform 0.3s ease',
          }}>
            {projects.map((project, index) => (
              <img
                key={index}
                src={project.imgSrc}
                className={`image ${isExpanded && activeImage === project.imgSrc ? 'expanded ' : ''}`}
                onClick={() => handleImageClick(project)}
                alt={`Project ${index + 1}`}
                draggable="false"
              />
            ))}
          </div>
        </div>
        {isExpanded && (
         <div
         ref={detailOverlayRef}
         className={`detail-overlay ${isExpanded ? 'active' : 'hidden'}`}
       >
         <div
           className={`detail-content ${
             activeProject?.title === 'CropCast'
               ? 'detail-content-cropcast'
               : activeProject?.title === 'Youtube To MP3 Converter'
               ? 'detail-content-youtube'
               : activeProject?.title === 'Portfolio'
               ? 'detail-content-portfolio'
               : 'detail-content-default'
           }`}
         >
           <h1 data-aos="fade-right" data-aos-delay="50">
             {activeProject?.title}
           </h1>
           <p data-aos="fade-in" data-aos-delay="150">
             {activeProject?.description}
           </p>
         </div>
         <div className="project-technologies" data-aos="fade-in" data-aos-delay="200">
           {activeProject?.technologies.map((tech, idx) => (
             <span key={idx} className="tech-tag">{tech}</span>
           ))}
         </div>
         <div className="buttons-container" data-aos="fade-in" data-aos-delay="300">
           {activeProject?.liveDemo && (
             <a
               href={activeProject.liveDemo}
               target="_blank"
               rel="noopener noreferrer"
               className="live-demo-button"
             >
               Live Demo <FontAwesomeIcon icon={faExternalLinkAlt} />
             </a>
           )}
           <a
             href={activeProject?.sourceUrl}
             target="_blank"
             rel="noopener noreferrer"
             className="view-source-button"
           >
             <FontAwesomeIcon icon={faGithub} /> View Source
           </a>
         </div>
         <button
           className="back-button"
           onClick={handleBackClick}
           data-aos="fade-right"
           data-aos-delay="50"
         >
           <FontAwesomeIcon icon={faArrowLeft} />
         </button>
       </div>
        )}
      </div>
      <div id='Contact' className='contact'>
        <div className="header-wrapper">
            <h2 className="contact-header" data-value="CONTACT" data-aos="fade">CONTACT</h2>
        </div>
        <div className='links'>
          <span className='email' data-aos="fade-up" data-aos-delay= "0">
            <a href='mailto:hassanrajam123@gmail.com' rel='noreferrer'>Email</a>
          </span>
          <span className='linkedin' data-aos="fade-up" data-aos-delay= "100">
          <a href='https://www.linkedin.com/in/hassan-raja-24b503259' target='_blank' rel='noreferrer'>LinkedIn</a>
          </span>
          <span className='github' data-aos="fade-up" data-aos-delay= "200">
          <a href='https://github.com/hassanraja04' target='_blank' rel='noreferrer'>GitHub</a>
          </span>
        </div>
      </div>
      <div className='footer' data-aos="fade-in" data-aos-delay= "300">
        Made by Hassan Raja © <span id="year">{currentYear}</span>
      </div>
    </div>
  );
}

export default App;
