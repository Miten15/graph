"use client";  // Necessary for using client-side hooks like useEffect

import React, { useEffect } from 'react';
import cytoscape from 'cytoscape';
import networkData from '../src/data/networkgraph.json';

const Page = () => {
  useEffect(() => {
    const elements = createCytoscapeData(networkData);

   const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: elements,
      style: [ // Node and edge styling
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'background-color': function(ele) {
              // Color nodes based on their type
              const deviceType = ele.data('type');
              if (deviceType === 'IT') return '#0074D9';  // Blue for IT Devices
              if (deviceType === 'OT') return '#FF4136';  // Red for OT Devices
              return '#2ECC40';  // Green for other devices
            },
            'font-size': '10px',
            'text-valign': 'center',
            'text-halign': 'center',
            'width': '20px',
            'height': '20px'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'cose',  // A layout that spreads nodes more naturally
        padding: 30,
        animate: true,
        animationDuration: 1000
      }
    });
  }, []);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div id="cy" style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};

const createCytoscapeData = (data) => {
  const elements = [];

  // Check if data has the expected structure
  if (Array.isArray(data) && data.length > 0 && data[0].mac_data) {
    const macData = data[0].mac_data;

    // Loop through each category (e.g., "IT Devices", "OT Devices")
    macData.forEach((category) => {
      Object.keys(category).forEach((deviceType) => {
        category[deviceType].forEach((device) => {
          const macAddress = device.MAC;
          if (macAddress && device[macAddress]) {
            // Add the main node (device MAC) and specify device type
            const mainNode = { 
              data: { id: macAddress, label: macAddress, type: deviceType.includes('IT') ? 'IT' : 'OT' }
            };
            elements.push(mainNode);

            // Add connections (edges)
            device[macAddress].forEach((connectedMac) => {
              const connectedNode = { 
                data: { id: connectedMac, label: connectedMac, type: 'unknown' }
              };
              elements.push(connectedNode);

              const edge = { 
                data: { source: macAddress, target: connectedMac }
              };
              elements.push(edge);
            });
          }
        });
      });
    });
  } else {
    console.error("Data does not contain the expected structure or MAC addresses.");
  }

  return elements;
};

export default Page;