import React, { useEffect, useRef } from 'react';  
import * as PANOLENS from 'panolens';
import eventService from '../../EventService';


export default function Panorama({pano, setPano}) {
    const viewerRef = useRef();
    
    eventService.emitEvent("closePano", false);

    useEffect(() => {
        let panorama, panorama1, panorama2, panorama3, panorama4, panorama5, viewer;

        panorama = new PANOLENS.ImagePanorama('../../../images/B1.JPG');
        panorama1 = new PANOLENS.ImagePanorama('../../../images/1.JPG');
        panorama2 = new PANOLENS.ImagePanorama('../../../images/2.JPG');
        panorama3 = new PANOLENS.ImagePanorama('../../../images/3.JPG');
        panorama4 = new PANOLENS.ImagePanorama('../../../images/4.JPG');
        panorama5 = new PANOLENS.ImagePanorama('../../../images/5.JPG');

        viewer = new PANOLENS.Viewer({ container: viewerRef.current });
        viewer.add(panorama, panorama1, panorama2, panorama3, panorama4, panorama5);


        // 지하
        const arrowInfospotUp_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp_1.position.set(-7000, 1500, 3850);
        arrowInfospotUp_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotUp_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp_2.position.set(-5000, 1500, -5050);
        arrowInfospotUp_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        arrowInfospotUp_1.addEventListener('click', () => {
            viewer.setPanorama(panorama1);
        });

        arrowInfospotUp_2.addEventListener('click', () => {
            viewer.setPanorama(panorama1);
        });

        panorama.add(arrowInfospotUp_1);
        panorama.add(arrowInfospotUp_2);


        // 1층
        const arrowInfospotUp1_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp1_1.position.set(-7500, 1500, 6500);
        arrowInfospotUp1_1.rotation.set(0, Math.PI, 0);
        arrowInfospotUp1_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotDown1_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown1_1.position.set(-2800, 500, 6000);
        arrowInfospotDown1_1.rotation.set(0, Math.PI, 0);
        arrowInfospotDown1_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotUp1_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp1_2.position.set(-5000, 1500, -5050);
        arrowInfospotUp1_2.rotation.set(0, Math.PI, 0);
        arrowInfospotUp1_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotDown1_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown1_2.position.set(-1500, 500, -4500);
        arrowInfospotDown1_2.rotation.set(0, Math.PI, 0);
        arrowInfospotDown1_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        arrowInfospotUp1_1.addEventListener('click', () => {
            viewer.setPanorama(panorama2);
        });

        arrowInfospotDown1_1.addEventListener('click', () => {
            viewer.setPanorama(panorama);
        });

        arrowInfospotUp1_2.addEventListener('click', () => {
            viewer.setPanorama(panorama2);
        });

        arrowInfospotDown1_2.addEventListener('click', () => {
            viewer.setPanorama(panorama);
        });

        panorama1.add(arrowInfospotUp1_1);
        panorama1.add(arrowInfospotUp1_2);
        panorama1.add(arrowInfospotDown1_1);
        panorama1.add(arrowInfospotDown1_2);



        // 2층
        const arrowInfospotUp2_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp2_1.position.set(-7000, 1500, 6500);
        arrowInfospotUp2_1.rotation.set(0, Math.PI, 0);
        arrowInfospotUp2_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotDown2_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown2_1.position.set(-2800, 500, 6000);
        arrowInfospotDown2_1.rotation.set(0, Math.PI, 0);
        arrowInfospotDown2_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotUp2_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp2_2.position.set(-5000, 1500, -5050);
        arrowInfospotUp2_2.rotation.set(0, Math.PI, 0);
        arrowInfospotUp2_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotDown2_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown2_2.position.set(-1500, 500, -4500);
        arrowInfospotDown2_2.rotation.set(0, Math.PI, 0);
        arrowInfospotDown2_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        arrowInfospotUp2_1.addEventListener('click', () => {
            viewer.setPanorama(panorama3);
        });

        arrowInfospotDown1_1.addEventListener('click', () => {
            viewer.setPanorama(panorama1);
        });

        arrowInfospotUp2_2.addEventListener('click', () => {
            viewer.setPanorama(panorama3);
        });

        arrowInfospotDown2_2.addEventListener('click', () => {
            viewer.setPanorama(panorama1);
        });

        panorama2.add(arrowInfospotUp2_1);
        panorama2.add(arrowInfospotDown2_1);
        panorama2.add(arrowInfospotUp2_2);
        panorama2.add(arrowInfospotDown2_2);


        // 3층
        const arrowInfospotUp3_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp3_1.position.set(-7000, 1500, 6500);
        arrowInfospotUp3_1.rotation.set(0, Math.PI, 0);
        arrowInfospotUp3_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotDown3_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown3_1.position.set(-2800, 500, 6000);
        arrowInfospotDown3_1.rotation.set(0, Math.PI, 0);
        arrowInfospotDown3_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotUp3_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp3_2.position.set(-5000, 1500, -5050);
        arrowInfospotUp3_2.rotation.set(0, Math.PI, 0);
        arrowInfospotUp3_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotDown3_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown3_2.position.set(-1500, 500, -4500);
        arrowInfospotDown3_2.rotation.set(0, Math.PI, 0);
        arrowInfospotDown3_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        arrowInfospotUp3_1.addEventListener('click', () => {
            viewer.setPanorama(panorama4);
        });
        arrowInfospotDown3_1.addEventListener('click', () => {
            viewer.setPanorama(panorama2);
        });
        arrowInfospotUp3_2.addEventListener('click', () => {
            viewer.setPanorama(panorama4);
        });
        arrowInfospotDown3_2.addEventListener('click', () => {
            viewer.setPanorama(panorama2);
        });

        panorama3.add(arrowInfospotUp3_1);
        panorama3.add(arrowInfospotDown3_1);
        panorama3.add(arrowInfospotUp3_2);
        panorama3.add(arrowInfospotDown3_2);

        // 4층
        const arrowInfospotUp4_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp4_1.position.set(-7000, 1500, 6500);
        arrowInfospotUp4_1.rotation.set(0, Math.PI, 0);
        arrowInfospotUp4_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotDown4_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown4_1.position.set(-2800, 500, 6000);
        arrowInfospotDown4_1.rotation.set(0, Math.PI, 0);
        arrowInfospotDown4_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotUp4_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotUp4_2.position.set(-5000, 1500, -5050);
        arrowInfospotUp4_2.rotation.set(0, Math.PI, 0);
        arrowInfospotUp4_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotDown4_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown4_2.position.set(-1500, 500, -4500);
        arrowInfospotDown4_2.rotation.set(0, Math.PI, 0);
        arrowInfospotDown4_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        arrowInfospotUp4_1.addEventListener('click', () => {
            viewer.setPanorama(panorama5);
        });
        arrowInfospotDown4_1.addEventListener('click', () => {
            viewer.setPanorama(panorama4);
        });
        arrowInfospotUp4_2.addEventListener('click', () => {
            viewer.setPanorama(panorama5);
        });
        arrowInfospotDown4_2.addEventListener('click', () => {
            viewer.setPanorama(panorama4);
        });

        panorama4.add(arrowInfospotUp4_1);
        panorama4.add(arrowInfospotDown4_1);
        panorama4.add(arrowInfospotUp4_2);
        panorama4.add(arrowInfospotDown4_2);

        // 5층
        const arrowInfospotDown5_1 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown5_1.position.set(1500, 500, 6000);
        arrowInfospotDown5_1.rotation.set(0, Math.PI, 0);
        arrowInfospotDown5_1.addHoverElement(document.getElementById('arrow-desc-container'), 200);

        const arrowInfospotDown5_2 = new PANOLENS.Infospot(350, PANOLENS.DataImage.Arrow);
        arrowInfospotDown5_2.position.set(1500, 1500, -5050);
        arrowInfospotDown5_2.rotation.set(0, Math.PI, 0);
        arrowInfospotDown5_2.addHoverElement(document.getElementById('arrow-desc-container'), 200);
        arrowInfospotDown5_1.addEventListener('click', () => {
            viewer.setPanorama(panorama4);
        });
        arrowInfospotDown5_2.addEventListener('click', () => {
            viewer.setPanorama(panorama4);
        });

        panorama5.add(arrowInfospotDown5_1);
        panorama5.add(arrowInfospotDown5_2);
    }, []);

    return (
        <div ref={viewerRef} style={{ width: '100%', height: '100%' }}>
            <div id="arrow-desc-container" style={{ display: 'none' }}>
            </div>
            <div type="button" onClick={()=>setPano(!pano)} className='po-abs' style={{zIndex: '1000', right: '2%', top: '2%', fontSize: '2rem', color: 'white'}}><i className="fa-solid fa-xmark"></i></div>
        </div>
    );
}