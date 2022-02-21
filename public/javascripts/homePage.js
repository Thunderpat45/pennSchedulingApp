/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/events.js":
/*!***********************!*\
  !*** ./src/events.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "events": () => (/* binding */ events)
/* harmony export */ });


const events = {
    events: {},
    
    subscribe: function(eventName, fn){
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },

    unsubscribe: function (eventName, fn){
        if(this.events[eventName]){
            for(let i = 0; i< this.events[eventName].length; i++){
                if(this.events[eventName][i] === fn){
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },

    publish: function (eventName, data){
        if(this.events[eventName]){
            this.events[eventName].forEach(function(fn){
                fn(data);
            })
        }
    }
}





/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/homePage.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/events */ "./src/events.js");


window.onload = setScriptData;

async function setScriptData(){
    try{
        const userPageJSON = await fetch('home/userData.json'); //change this to accept userId and season
        const userPageData = await userPageJSON.json();
        console.log(userPageJSON.body);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataFetched", userPageData);
        _src_events__WEBPACK_IMPORTED_MODULE_0__.events.publish("userDataSet");
        
    }catch(err){
        console.log(err)
    }
}
})();

/******/ })()
;
//# sourceMappingURL=homePage.js.map