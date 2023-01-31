/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/homeMap.js":
/*!***************************!*\
  !*** ./src/js/homeMap.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  const lat = 6.2700263;\r\n  const lng = -75.5800203;\r\n  const map = L.map(\"map-home\").setView([lat, lng], 15);\r\n\r\n  let markers = new L.FeatureGroup().addTo(map);\r\n\r\n  let properties = [];\r\n\r\n  const filter = {\r\n    category: \"\",\r\n    price: \"\",\r\n  };\r\n\r\n  const categoriesSelect = document.querySelector(\"#categories\");\r\n  const pricesSelect = document.querySelector(\"#prices\");\r\n\r\n  L.tileLayer(\"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png\", {\r\n    attribution:\r\n      '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors',\r\n  }).addTo(map);\r\n\r\n  categoriesSelect.addEventListener(\"change\", (e) => {\r\n    filter.category = +e.target.value;\r\n    filterProperties();\r\n  });\r\n\r\n  pricesSelect.addEventListener(\"change\", (e) => {\r\n    filter.price = +e.target.value;\r\n    filterProperties();\r\n  });\r\n\r\n  const getProperties = async () => {\r\n    try {\r\n      const url = \"/api/properties\";\r\n      const resp = await fetch(url);\r\n      properties = await resp.json();\r\n      showProperties(properties);\r\n    } catch (error) {\r\n      console.log(error);\r\n    }\r\n  };\r\n\r\n  const showProperties = (p) => {\r\n    markers.clearLayers();\r\n\r\n    p.properties.forEach((property) => {\r\n      const marker = new L.marker([property?.lat, property?.lng], {\r\n        autoPan: true,\r\n      })\r\n        .addTo(map)\r\n        .bindPopup(\r\n          `<h3 class=\"font-bold uppercase my-5\">${property?.title}</h3>\r\n            <img src=\"uploads/${property?.image}\" alt=\"${property.title}\">\r\n            <p class=\"text-indigo-600\">${property.category.name}</p>\r\n            <p class=\"text-gray-600\">${property.price.name}</p>\r\n            <a href=\"/property/${property.id}\" class=\"bg-indigo-600 text-white uppercase block p-2 rounded text-center\">Show Property</a>\r\n          `\r\n        );\r\n\r\n      markers.addLayer(marker);\r\n    });\r\n  };\r\n\r\n  const filterProperties = () => {\r\n    const result = properties.properties\r\n      .filter(filterCategory)\r\n      .filter(filterPrice);\r\n    showProperties({ properties: result });\r\n  };\r\n\r\n  const filterCategory = (prop) => {\r\n    return filter.category ? prop.categoryID === filter.category : prop;\r\n  };\r\n\r\n  const filterPrice = (prop) => {\r\n    return filter.price ? prop.priceID === filter.price : prop;\r\n  };\r\n\r\n  getProperties();\r\n})();\r\n\n\n//# sourceURL=webpack://real_state/./src/js/homeMap.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/homeMap.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;