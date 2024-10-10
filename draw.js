//import networkData from '../src/data/network-graph.json';
import networkData from '../src/data/networkgraph'
const createCytoscapeData = (data) => {
    const elements = [];
  
    // Add the main node (root)
    const mainNode = { data: { id: data.MAC, label: data.MAC } };
    elements.push(mainNode);
  
    // Add connections (edges) and nodes
    data[data.MAC].forEach((mac) => {
      const node = { data: { id: mac, label: mac } };
      const edge = { data: { source: data.MAC, target: mac } };
  
      elements.push(node);
      elements.push(edge);
    });
  
    return elements;
  };
  
  const elements = createCytoscapeData(networkData);
  