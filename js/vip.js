
document.addEventListener('DOMContentLoaded', function() {
     // Create grid pattern
     const gridPattern = document.getElementById('gridPattern');
     for (let i = 0; i < 64; i++) {
         const gridItem = document.createElement('div');
         gridItem.className = 'grid-item';
         gridPattern.appendChild(gridItem);
     }

     // Page navigation
     const page1 = document.getElementById('page1');
     const page2 = document.getElementById('page2');
     const nextButton = document.getElementById('nextButton');
     const joinButton = document.getElementById('joinButton');
     const loader = document.getElementById('loader');
     const buttonText = document.getElementById('buttonText');

     nextButton.addEventListener('click', () => {
         page1.style.display = 'none';
         page2.style.display = 'block';
     });

     // Toggle loading state
     function setLoading(isLoading) {
         joinButton.disabled = isLoading;
         loader.classList.toggle('active', isLoading);
         buttonText.textContent = isLoading ? 'Loading...' : 'Join THRD Insider';
     }

     // Show notification (simple alert for now, can be enhanced)
     function showNotification(message, isError = true) {
         alert(message); // Replace with a styled notification if desired
     }

     // Join WhatsApp community
     joinButton.addEventListener('click', async () => {
         setLoading(true);

         try {
             // Fetch group snapshot
             const snapshotRes = await fetch('https://psf5kjuexa.execute-api.ap-south-1.amazonaws.com/s1/snapshot', {
                 method: 'GET',
                 headers: { 'Content-Type': 'application/json' }
             });

             if (!snapshotRes.ok) throw new Error('Failed to fetch group data');
             const snapshotData = await snapshotRes.json();

             if (snapshotData.statusCode !== 200 || !snapshotData.data?.invite_link) {
                 throw new Error('No available group at the moment');
             }

             const inviteLink = snapshotData.data.invite_link;

             // Update participant count
             await fetch(`https://sdv7rb0e37.execute-api.ap-south-1.amazonaws.com/s1/snapshot?group_id=${snapshotData.data.group_id}`, {
                 method: 'PUT',
                 headers: { 'Content-Type': 'application/json' }
             });

             // Redirect to WhatsApp (reliable across browsers, including Safari)
             window.location.href = inviteLink;

         } catch (error) {
             console.error('Error joining community:', error);
             showNotification(error.message || 'Something went wrong. Please try again.');
             setLoading(false); // Reset button state on error
         }
     });

     // Counter increment on page load
     const COUNTER_URL = 'http://3.110.163.18:5000/api/website/counter?base_name=vip'; // Update to HTTPS if possible
     window.onload = async () => {
         try {
             const response = await fetch(COUNTER_URL, { method: 'GET' });
             const data = await response.json();
             console.log('Counter updated:', data);
         } catch (error) {
             console.error('Error updating counter:', error);
         }
     };
});