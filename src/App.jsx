import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as fabric from "fabric";
import "./App.css";

const UNSPLASH_ACCESS_KEY = "HAwwJBTHcI9Be-TIbkir_Ga1jHWkmv52sE6VgK8Q5Uc"; // Replace with your Unsplash API key

const App = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const canvasRef = useRef(null);

  // Fetch images from Unsplash API
  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      setImages(response.data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // useEffect(() => {
  //   if (selectedImage) {
  //     const canvas = new fabric.Canvas("canvas");
  //     canvasRef.current = canvas;

  //     fabric.Image.fromURL(selectedImage, (img) => {
  //       img.set({ left: 50, top: 50, scaleX: 0.5, scaleY: 0.5 });
  //       canvas.add(img);
  //       canvas.renderAll();
  //     });

  //     return () => {
  //       canvas.dispose();
  //     };
  //   }
  // }, [selectedImage]);

  // // // Add text to canvas
  // const addText = () => {
  //   const canvas = canvasRef.current;
  //   const text = new Text("Your Caption", {
  //     left: 100,
  //     top: 100,
  //     fontSize: 20,
  //     fill: "black",
  //     editable: true,
  //   });
  //   canvas.add(text);
  // };

  // // // Add shapes to canvas
  // const addShape = (shape) => {
  //   const canvas = canvasRef.current;
  //   let newShape;
  //   switch (shape) {
  //     case "rectangle":
  //       newShape = new Rect({
  //         left: 50,
  //         top: 50,
  //         fill: "red",
  //         width: 100,
  //         height: 60,
  //       });
  //       break;
  //     case "circle":
  //       newShape = new Circle({ left: 80, top: 80, fill: "blue", radius: 40 });
  //       break;
  //     case "triangle":
  //       newShape = new Triangle({
  //         left: 120,
  //         top: 120,
  //         fill: "green",
  //         width: 80,
  //         height: 80,
  //       });
  //       break;
  //     default:
  //       return;
  //   }
  //   canvas.add(newShape);
  // };

  // // // Download the modified image
  // const downloadImage = () => {
  //   const canvas = canvasRef.current;
  //   const dataURL = canvas.toDataURL({ format: "png" });

  //   const link = document.createElement("a");
  //   link.href = dataURL;
  //   link.download = "edited-image.png";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // Initialize fabric.js canvas
  useEffect(() => {
    if (selectedImage) {
      const canvas = new fabric.Canvas("canvas", {
        preserveObjectStacking: true, // Ensures layering is maintained
      });
      canvasRef.current = canvas;

      // Load image into canvas
      fabric.Image.fromURL(selectedImage, (img) => {
        img.set({
          left: 50,
          top: 50,
          scaleX: 0.5,
          scaleY: 0.5,
        });
        canvas.add(img);
        canvas.centerObject(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });

      let imageElement = document.createElement("img");
      imageElement.src = selectedImage;
      imageElement.onload = function () {
        let image = new fabric.Image(imageElement);
        canvas.add(image);
        canvas.centerObject(image);
        canvas.setActiveObject(image);
      };

      return () => {
        canvas.dispose();
      };
    }
  }, [selectedImage]);

  // Add text to canvas
  const addText = () => {
    const canvas = canvasRef.current;

    const text = new fabric.Textbox("Your Caption", {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "black",
      selectable: true,
      editable: true,
      borderColor: "black",
      cornerColor: "red",

      hasControls: true,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  // Add shapes to canvas
  const addShape = (shape) => {
    const canvas = canvasRef.current;
    let newShape;
    switch (shape) {
      case "rectangle":
        newShape = new fabric.Rect({
          left: 50,
          top: 50,
          fill: "red",
          width: 100,
          height: 60,
          hasControls: true,
        });
        break;
      case "circle":
        newShape = new fabric.Circle({
          left: 80,
          top: 80,
          fill: "blue",
          radius: 40,
          hasControls: true,
        });
        break;
      case "triangle":
        newShape = new fabric.Triangle({
          left: 120,
          top: 120,
          fill: "green",
          width: 80,
          height: 80,
          hasControls: true,
        });
        break;
      default:
        return;
    }
    canvas.add(newShape);
  };

  // Download the modified image
  const downloadImage = () => {
    const canvas = canvasRef.current;
    canvas.renderAll();
    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1, // Best quality
    });
    // Create a temporary link element
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "canvas-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="container">
      <h1>Image Editor</h1>
      <div>
        <input
          type="text"
          placeholder="Search for images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={fetchImages}>Search</button>
      </div>
      <div className="image-grid">
        {images.map((img) => (
          <div key={img.id} className="image-item">
            <img src={img.urls.small} alt={img.alt_description} />
            <button onClick={() => setSelectedImage(img.urls.small)}>
              Add Captions
            </button>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="flex ">
          <canvas
            style={{ border: "1px solid black" }}
            width="500"
            height="500"
            id="canvas"
          ></canvas>
          <div className="controls">
            <button onClick={addText}>Add Text</button>
            <button onClick={() => addShape("rectangle")}>Rectangle</button>
            <button onClick={() => addShape("circle")}>Circle</button>
            <button onClick={() => addShape("triangle")}>Triangle</button>
            <button onClick={downloadImage}>Download</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
