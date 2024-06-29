document.addEventListener("DOMContentLoaded", function () {
    const addMarkerBtn = document.getElementById('addMarkerBtn');
    const addTourMarkerBtn = document.getElementById('addTourMarkerBtn');
    const loadAllMarkersBtn = document.getElementById('loadAllMarkersBtn');
    const clearAllMarkersBtn = document.getElementById('clearAllMarkersBtn');
    const exportTxtBtn = document.getElementById('exportTxtBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const importJsonBtn = document.getElementById('importJsonBtn');
    const exportSvgBtn = document.getElementById('exportSvgBtn');
    const generateLinkBtn = document.getElementById('generateLinkBtn');
    const uploadImageInput = document.getElementById('uploadImage');
    const markerLabelInput = document.getElementById('markerLabel');
    const panoramaContainer = document.getElementById('panorama');
    const fallbackImage = document.getElementById('fallbackImage');
    const jsonFileInput = document.getElementById('jsonFileInput');

    let panoramaViewer;
    let markers = [];
    let currentPanorama = "";
    let scenes = {};
    let isAuthenticated = false;

    function getHtml(template) {
        return template.join("\n");
    }

    function listLocalPanoramas() {
        retrieveLocalPanoramaImageNames().then((imageNames) => {
            const dropdownItems = imageNames.map((imageName) => {
                return getHtml([
                    `<option value="${imageName}">`,
                    imageName,
                    "</option>",
                ]);
            });

            const dropdownWrapperStart = document.createElement("div");
            dropdownWrapperStart.innerHTML = getHtml(dropdownItems);

            const dropdownWrapperEnd = document.createElement("div");
            dropdownWrapperEnd.innerHTML = getHtml(dropdownItems);

            // Optional tour dropdowns for future use
            const tourStartSelect = document.getElementById('tourStart');
            const tourEndSelect = document.getElementById('tourEnd');
            if (tourStartSelect && tourEndSelect) {
                tourStartSelect.innerHTML = '<option value="">Select</option>' + dropdownWrapperStart.innerHTML;
                tourEndSelect.innerHTML = '<option value="">Select</option>' + dropdownWrapperEnd.innerHTML;
            }
        });
    }

    function updateImage(imageName) {
        const imageSrc = `path/to/your/images/${imageName}`;
        initializePannellum(imageName, imageSrc);
    }

    function retrieveLocalPanoramaImageNames() {
        // Simulating a function that fetches image names from the server or local storage
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(["panorama1.jpg", "panorama2.jpg", "panorama3.jpg"]);
            }, 1000);
        });
    }

    uploadImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const panoramaName = file.name;
                initializePannellum(panoramaName, e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    addMarkerBtn.addEventListener('click', addMarker);
    addTourMarkerBtn.addEventListener('click', addTourMarker);
    loadAllMarkersBtn.addEventListener('click', loadAllMarkers);
    clearAllMarkersBtn.addEventListener('click', clearAllMarkers);
    exportTxtBtn.addEventListener('click', exportAnnotationsAsText);
    exportExcelBtn.addEventListener('click', exportAnnotationsAsExcel);
    exportJsonBtn.addEventListener('click', exportAnnotationsAsJson);
    importJsonBtn.addEventListener('click', () => jsonFileInput.click());
    jsonFileInput.addEventListener('change', importAnnotationsFromJson);
    exportSvgBtn.addEventListener('click', exportAsSvg);
    generateLinkBtn.addEventListener('click', generateShareableLink);

    function initializePannellum(panoramaName, imageSrc) {
        scenes[panoramaName] = {
            type: 'equirectangular',
            panorama: imageSrc,
            hotSpots: markers.filter(marker => marker.panorama === panoramaName).map(marker => ({
                pitch: marker.pitch,
                yaw: marker.yaw,
                type: marker.targetPanorama ? 'scene' : 'info',
                text: marker.label,
                sceneId: marker.targetPanorama || undefined,
            }))
        };

        if (panoramaViewer) {
            panoramaViewer.destroy();
        }

        panoramaViewer = pannellum.viewer('panorama', {
            default: {
                firstScene: panoramaName,
                sceneFadeDuration: 1000,
                compass: true
            },
            autoLoad: true,  // Enable autoLoad
            scenes: scenes
        });

        currentPanorama = panoramaName;
        fallbackImage.style.display = 'none';
        panoramaContainer.style.display = 'block';
        updateHotspotList();
    }

    function addMarker() {
        const label = markerLabelInput.value || 'Unnamed Marker';
        const pitch = panoramaViewer.getPitch();
        const yaw = panoramaViewer.getYaw();
        const marker = { pitch, yaw, label, panorama: currentPanorama };
        markers.push(marker);
        panoramaViewer.addHotSpot({
            pitch: marker.pitch,
            yaw: marker.yaw,
            type: 'info',
            text: marker.label,
        }, currentPanorama);
        saveMarker(marker);
        updateHotspotList();
    }

    function addTourMarker() {
        const label = markerLabelInput.value || 'Unnamed Marker';
        const panoramaName = prompt("Enter the name of the panorama image to redirect to:");
        if (!panoramaName) {
            alert('Panorama name is required!');
            return;
        }
        const imageSrc = `path/to/your/images/${panoramaName}`;
        if (!scenes[panoramaName]) {
            scenes[panoramaName] = {
                type: 'equirectangular',
                panorama: imageSrc,
                hotSpots: []
            };
        }
        const pitch = panoramaViewer.getPitch();
        const yaw = panoramaViewer.getYaw();
        const marker = { pitch, yaw, label, panorama: currentPanorama, targetPanorama: panoramaName };
        markers.push(marker);
        panoramaViewer.addHotSpot({
            pitch: marker.pitch,
            yaw: marker.yaw,
            type: 'scene',
            text: marker.label,
            sceneId: panoramaName,
        }, currentPanorama);
        saveMarker(marker);
        updateHotspotList();
    }

    function saveMarker(marker) {
        fetch('server/save_marker.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `panorama=${encodeURIComponent(marker.panorama)}&marker=${encodeURIComponent(JSON.stringify(marker))}`
        }).then(response => response.text())
          .then(data => console.log(data))
          .catch(error => console.error('Error:', error));
    }

    function loadMarkers(panorama) {
        fetch('server/load_markers.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `panorama=${encodeURIComponent(panorama)}`
        }).then(response => response.json())
          .then(data => {
              markers = data;
              initializePannellum(currentPanorama, `path/to/your/images/${currentPanorama}`);
          })
          .catch(error => console.error('Error:', error));
    }

    function loadHotspot(index) {
        const marker = markers[index];
        panoramaViewer.addHotSpot({
            pitch: marker.pitch,
            yaw: marker.yaw,
            type: marker.targetPanorama ? 'scene' : 'info',
            text: marker.label,
            sceneId: marker.targetPanorama || undefined,
        }, marker.panorama);
    }

    function loadAllMarkers() {
        panoramaViewer.getConfig().scenes[currentPanorama].hotSpots.forEach(hotSpot => {
            panoramaViewer.removeHotSpot(hotSpot.id);
        });

        markers.filter(marker => marker.panorama === currentPanorama).forEach((marker, index) => {
            loadHotspot(index);
        });
    }

    function clearAllMarkers() {
        panoramaViewer.getConfig().scenes[currentPanorama].hotSpots.forEach(hotSpot => {
            panoramaViewer.removeHotSpot(hotSpot.id);
        });

        markers = [];
        updateHotspotList();
    }

    function updateHotspotList() {
        const hotspotList = document.getElementById('hotspotList');
        hotspotList.innerHTML = '';
        markers.forEach((marker, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `Label: ${marker.label}, Panorama: ${marker.panorama}`;
            const loadButton = document.createElement('button');
            loadButton.textContent = 'Load';
            loadButton.style.display = (marker.panorama === currentPanorama) ? 'block' : 'none';
            loadButton.addEventListener('click', () => loadHotspot(index));
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.style.display = (marker.panorama === currentPanorama) ? 'block' : 'none';
            removeButton.addEventListener('click', () => removeHotspot(index));
            listItem.appendChild(loadButton);
            listItem.appendChild(removeButton);
            hotspotList.appendChild(listItem);
        });
    }

    function generateShareableLink() {
        const baseUrl = window.location.origin + window.location.pathname;
        const markersEncoded = encodeURIComponent(JSON.stringify(markers));
        const email = prompt("Enter your email (optional):", "");
        let link = `${baseUrl}?scene_id=${encodeURIComponent(currentPanorama)}&config_id=${markersEncoded}`;
        if (email) {
            link += `&email=${encodeURIComponent(email)}`;
        }
        prompt("Copy this link to share:", link);
    }

    function exportAnnotationsAsText() {
        const annotations = markers.map(marker => `Label: ${marker.label}, Panorama: ${marker.panorama}, Pitch: ${marker.pitch}, Yaw: ${marker.yaw}`).join('\n');
        const blob = new Blob([annotations], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotations.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function exportAnnotationsAsExcel() {
        const worksheet = XLSX.utils.json_to_sheet(markers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Annotations');
        XLSX.writeFile(workbook, 'annotations.xlsx');
    }

    function exportAnnotationsAsJson() {
        const json = JSON.stringify(markers, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotations.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importAnnotationsFromJson(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedMarkers = JSON.parse(e.target.result);
                    importedMarkers.forEach(marker => {
                        if (marker.panorama === currentPanorama) {
                            panoramaViewer.addHotSpot({
                                pitch: marker.pitch,
                                yaw: marker.yaw,
                                type: 'info',
                                text: marker.label,
                            }, marker.panorama);
                            markers.push(marker);
                        }
                    });
                    updateHotspotList();
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Error parsing JSON file.');
                }
            };
            reader.readAsText(file);
        }
    }

    function exportAsSvg() {
        const svgNamespace = 'http://www.w3.org/2000/svg';
        const svgElement = document.createElementNS(svgNamespace, 'svg');
        svgElement.setAttribute('width', panoramaContainer.clientWidth);
        svgElement.setAttribute('height', panoramaContainer.clientHeight);
        svgElement.setAttribute('xmlns', svgNamespace);

        const imageElement = document.createElementNS(svgNamespace, 'image');
        imageElement.setAttribute('href', panoramaViewer.getConfig().scenes[currentPanorama].panorama);
        imageElement.setAttribute('width', '100%');
        imageElement.setAttribute('height', '100%');
        svgElement.appendChild(imageElement);

        markers.filter(marker => marker.panorama === currentPanorama).forEach(marker => {
            const hotspot = document.createElementNS(svgNamespace, 'circle');
            const cx = (marker.yaw + 180) * (panoramaContainer.clientWidth / 360);
            const cy = (90 - marker.pitch) * (panoramaContainer.clientHeight / 180);
            hotspot.setAttribute('cx', cx);
            hotspot.setAttribute('cy', cy);
            hotspot.setAttribute('r', 5);
            hotspot.setAttribute('fill', 'red');
            svgElement.appendChild(hotspot);

            const text = document.createElementNS(svgNamespace, 'text');
            text.setAttribute('x', cx);
            text.setAttribute('y', cy - 10);
            text.setAttribute('fill', 'black');
            text.setAttribute('font-size', '12px');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = marker.label;
            svgElement.appendChild(text);
        });

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'panorama_annotations.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (
                canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    if (!isWebGLAvailable()) {
        panoramaContainer.style.display = 'none';
        fallbackImage.style.display = 'block';
    }

    listLocalPanoramas(); // List the local panoramas on page load

    // Load panorama and markers from URL parameters if present
    const urlParams = new URLSearchParams(window.location.search);
    const sceneId = urlParams.get('scene_id');
    const configId = urlParams.get('config_id');
    const email = urlParams.get('email');

    if (sceneId && configId) {
        const markersDecoded = JSON.parse(decodeURIComponent(configId));
        const imageSrc = `img/${sceneId}`;
        markers = markersDecoded;
        initializePannellum(sceneId, imageSrc);
        updateHotspotList();
        if (email) {
            // Logic for handling email parameter (e.g., check if user is logged in)
            console.log(`Email provided: ${email}`);
            isAuthenticated = true; // Assume authenticated if email is provided
        } else {
            // Logic for view-only mode
            console.log('View-only mode');
            isAuthenticated = false;
        }
    }
});
