var cIdN = 0;
var cIdE = 0;

var container = document.getElementById("pizarra");

var locales = {
  en: {
    edit: 'Editar',
    del: 'Eliminar',
    back: 'Volver',
    addNode: 'Añadir nodo',
    addEdge: 'Añadir enlace',
    editNode: 'Editar nodo',
    editEdge: 'Editar enlace',
    addDescription: 'Haga click en un espacio vacio para agregar un nuevo nodo.',
    edgeDescription: 'Haga click en un nodo y arrastre el enlace hasta otro nodo para conectarlos.',
    editEdgeDescription: 'Haga click en cualquiera de los puntos y arrastrelos hasta el nodo que quiera conectar.',
    createEdgeError: 'Cannot link edges to a cluster.',
    deleteClusterError: 'Clusters cannot be deleted.',
    editClusterError: 'Clusters cannot be edited.'
  }
}

var nodes = new vis.DataSet([]);
  
  var edges = new vis.DataSet([]);
  
 
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    width: "100%",
    height: "800px",
    
    locale: 'en',
    locales: locales,
    manipulation:{
      addNode:function(nodeData,callback){
        addNodo(nodeData,callback);
      },
      addEdge:function(edgeData,callback){
        addEnlace(edgeData,callback);
      },
      editNode:function(nodeData,callback){
        editarNodo(nodeData,callback);
      },
      editEdge: function(edgeData,callback){
        editarEnlace(edgeData,callback);
      }
      
    },
    nodes: {
      color: "#F8F8FF",
      font: {
        color: "black",
        size: 24,
      },
    },
    edges: {
      color: {
        color: "#000000",
        highlight: "#848484",
        hover: "#848484",

      },
    arrows: {
      to: {
        enabled: true,
        type: "triangle",
      },
    },
    font: {
      color: "#f5f5f5",
      size: 10,
      align: "horizontal",
      background: "none",
      strokeWidth: 0,
      align: "top",
      size: 24,
    },
  },
};


const addNodo = (nodeData,callback) =>{
  var nom;
  if (nodes.length == 0) {
    cIdN = 0;
  }
  
  do{
    nom = prompt("Nombre del nodo:","");
    if (nom.length == 0) {
      alert("Campo vacio");
    }
  }while(nom.length == 0);
  
  nodeData.id = cIdN++;
  nodeData.label = nom;
  callback(nodeData);
};



const addEnlace = (edgeData,callback) =>{
  var nom;
  var control=false;
  var c;
  if (edges.length === 0) {
    cIdE = 0;
  }
  
  while (control == false) {
    nom = prompt("Nombre del atributo:");
    c=parseFloat(nom);
    if (nom.length == 0) {
      alert("Campo vacio");
    }else{
      if (isNaN(c)) {
        alert("solo puedes ingresar valores numericos");
      }else{
        control=true;
      }
      
    }

  }
  edgeData.id = cIdE++;
  edgeData.label = nom;
  callback(edgeData);
};

const editarNodo = (nodeData,callback) =>{
  var nom;
  var control=false;
  
  while (control == false) {
    nom = prompt("Nuevo nombre del nodo:");
    if (nom.length == 0) {
      alert("Campo vacio");
    }else{
      control=true;
    }
  }
  nodeData.label = nom;
  callback(nodeData);
};

const editarEnlace = (edgeData,callback) =>{
  var nom;
  var control=false;
  var c;
  while (control == false) {
    nom = prompt("Nuevo nombre del atributo:");
    c=parseFloat(nom);
    if (nom.length == 0) {
      alert("Campo vacio");
    }else{
       if (isNaN(c)) {
        alert("solo puedes ingresar valores numericos");
      }else{
        control=true;
      }
    }
  }
  edgeData.label = nom;
  callback(edgeData);
};

const generarMatriz = () =>{
  let m = Array(nodes.length)
    .fill(0)
    .map(() => Array(nodes.length).fill(0));

  edges.forEach((enlace) =>{
    m[enlace.from][enlace.to]=enlace.label;

  });

  var sfilas = [];
  var scolum = [];
  for (var i = 0; i < m.length; i++) {
    var sf = 0;
    var sc = 0;
    for (var j = 0; j < m.length; j++) {
      sf=sf+parseFloat(m[i][j]);
      sc=sc+parseFloat(m[j][i]);
    }
    sfilas.push(sf);
    scolum.push(sc);
  }
  
   var arrayNodos =[];
   let matriz = "Nodos,";
   nodes.forEach((nodo) => {
      matriz = matriz + nodo.label+",";
      arrayNodos.push(nodo.label);
   });

   matriz = matriz + "SumF|";

   for (var i = 0; i < m.length; i++) {
     matriz = matriz + arrayNodos[i]+",";
     for (let j = 0; j < m.length; j++) {
       matriz = matriz + m[i][j]+",";
     }

     matriz = matriz + sfilas[i] + "|";
   }
   matriz = matriz +"SumC,";
   scolum.forEach((col) => (
      matriz = matriz +col+","
    ));

   ArrayMatriz(matriz);

};

const ArrayMatriz = (mat) => {
  let Mmostrar = Array(nodes.length + 2)
    .fill(0)
    .map(() => Array(nodes.length + 2).fill(0));

  let filas = mat.split(["|"]);

  for (let i = 0; i < filas.length; i++) {
    let columnas = filas[i].split(",");

    for (let j = 0; j < columnas.length; j++) {
      Mmostrar[i][j] = columnas[j];
    }
  }

  crearTablaM(Mmostrar);
};

const crearTablaM = (datosM) => {
  let tabla = document.getElementById("TablaMatriz");

  var cuerpoT = createCustomElement("tbody");

  tabla.innerHTML = "";

  datosM.forEach(function (datosFilas) {
    var fila = createCustomElement("tr");

    datosFilas.forEach(function (datosCeldas) {
      var celda = createCustomElement("th");

      celda.appendChild(document.createTextNode(datosCeldas));
      fila.appendChild(celda);
    });

    cuerpoT.appendChild(fila);
  });

  tabla.appendChild(cuerpoT);
};

const createCustomElement = (element, attributes, children) => {
  let customElement = document.createElement(element);

  if (children !== undefined) {
    children.forEach((child) => {
      if (child.nodeType) {
        if (child.nodeType === 1 || child.nodeType === 11)
        customElement.appendChild(child);
        else customElement.innerHTML += child;
      }
    });
  }

  addAtributes(customElement, attributes);
  return customElement;
};

const addAtributes = (element, attrObj) => {
  for (let attr in attrObj) {
    if (attrObj.hasOwnProperty(attr)) element.setAttribute(attr, attrObj[attr]);
  }
};

 var network = new vis.Network(container, data, options);
