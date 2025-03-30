
    document.addEventListener("DOMContentLoaded", function () {
        gsap.registerPlugin(ScrollTrigger);

        const sections = document.querySelectorAll('.section');

        sections.forEach(section => {
            gsap.fromTo(section, {
                opacity: 0,
                y: 50
            }, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    end: "bottom center",
                    scrub: false,
                    markers: false,
                    toggleActions: "play none none reverse",
                }
            });
        });
    });
    
        let balance = 1445; // Declare balance outside the function

        document.querySelector('.balance').innerText = 'Balance: $' + balance;

        function toggleMenu() {
            const menu = document.getElementById('menu');
            const overlay = document.getElementById('overlay');
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
        }

        document.getElementById('overlay').addEventListener('click', function () {
            toggleMenu();
        });

        function transferFunds() {
            const senderNumber = document.getElementById('senderNumber').value;
            const receiverNumber = document.getElementById('receiverNumber').value;
            const amount = parseFloat(document.getElementById('amount').value); // Use parseFloat to handle decimal values


            if (!senderNumber || !receiverNumber || isNaN(amount)) {  //isNaN is to confirm if the amount isnt a number
                alert("Please fill in all fields with valid numbers.");
                return;
            } else if (amount > balance) {
                alert("Insufficient balance.");
                return;
            }
           
    
          



            setTimeout(() => {
            

                 //UPDATE THE BALANCE HERE
                balance -= amount;   // Update the balance
                document.querySelector('.balance').innerText = 'Balance: $' + balance; // Update balance in the UI

                alert(`Transfer successful!\nFrom: ${senderNumber}\nTo: ${receiverNumber}\nAmount: $${amount}`);

            }, 1000);

            document.getElementById('bgVideo2').style.display = 'block'; // Show the loading video
            document.getElementById('bgVideo2').play(); // Play the loading video
            document.getElementById('transferButton').disabled = true;
           
    
    
            
                    
            let video = document.getElementById('bgVideo2');
                video.onended = function() {
                 video.style.display = 'none'; // Hide video after playback
                  document.getElementById('transferButton').disabled = false; // Re-enable button
            };  
        } // Disable the button to prevent multiple clicks

        
       
          

        document.addEventListener("mousemove", (event) => {
            const cursorLight = document.getElementById("cursorLight");
            cursorLight.style.transform = 'translate(${event.clientX}px, ${event.clientY}px)';
           
        });
        function toggleProfileOptions() {
            const profileOptions = document.getElementById('profileOptions');
            profileOptions.classList.toggle('active');
        }
        
        document.addEventListener('click', function (event) {
            const profileImage = document.querySelector('.profile img');
            const profileOptions = document.getElementById('profileOptions');
        
            // Open profile options when the profile image is clicked
            if (profileImage.contains(event.target)) {
                toggleProfileOptions();
            } 
            // Close profile options when clicking outside the profile area
            else if (!profileImage.contains(event.target) && !profileOptions.contains(event.target) && profileOptions.classList.contains('active')) {
                profileOptions.classList.remove('active');
            }
        });
        

        document.addEventListener('click', function (event) {
            const profileImage = document.querySelector('.profile img');
            const profileOptions = document.getElementById('profileOptions');
            
            // Open profile options when the profile image is clicked
            if (profileImage.contains(event.target)) {
                toggleProfileOptions();
            } 
            // Close profile options when clicking outside the profile area
            else if (!profileImage.contains(event.target) && profileOptions.classList.contains('active')) {
                profileOptions.classList.remove('active');
            }
        });
document.addEventListener("mousemove", (event) => {
                const cursorLight = document.getElementById("cursorLight");
                cursorLight.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
            });
      