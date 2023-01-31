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

/***/ "./src/js/changeState.js":
/*!*******************************!*\
  !*** ./src/js/changeState.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n  const btnChangeState = document.querySelectorAll(\".change-state\");\r\n  const token = document\r\n    .querySelector('meta[name=\"csrf-token\"]')\r\n    .getAttribute(\"content\");\r\n\r\n  btnChangeState.forEach((btn) => {\r\n    btn.addEventListener(\"click\", changeStateProperty);\r\n  });\r\n\r\n  async function changeStateProperty(e) {\r\n    const { propertyId: id } = e.target.dataset;\r\n    console.log(id);\r\n\r\n    try {\r\n      const url = `/properties/${id}`;\r\n      const resp = await fetch(url, {\r\n        method: \"PUT\",\r\n        headers: { \"CSRF-TOKEN\": token },\r\n      });\r\n      const { result } = await resp.json();\r\n\r\n      if (result) {\r\n        if (e.target.classList.contains(\"bg-green-200\")) {\r\n          e.target.textContent = \"Not Public\";\r\n          e.target.classList.add(\"bg-red-200\", \"text-red-800\");\r\n          e.target.classList.remove(\"bg-green-200\", \"text-green-800\");\r\n        } else {\r\n          e.target.textContent = \"Public\";\r\n          e.target.classList.remove(\"bg-red-200\", \"text-red-800\");\r\n          e.target.classList.add(\"bg-green-200\", \"text-green-800\");\r\n        }\r\n      }\r\n    } catch (error) {\r\n      console.log(error);\r\n    }\r\n  }\r\n})();\r\n\n\n//# sourceURL=webpack://real_state/./src/js/changeState.js?");

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
/******/ 	__webpack_modules__["./src/js/changeState.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;