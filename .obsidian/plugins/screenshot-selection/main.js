"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => ScreenshotSelectionPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// node_modules/modern-screenshot/dist/index.mjs
function changeJpegDpi(uint8Array, dpi) {
  uint8Array[13] = 1;
  uint8Array[14] = dpi >> 8;
  uint8Array[15] = dpi & 255;
  uint8Array[16] = dpi >> 8;
  uint8Array[17] = dpi & 255;
  return uint8Array;
}
var _P = "p".charCodeAt(0);
var _H = "H".charCodeAt(0);
var _Y = "Y".charCodeAt(0);
var _S = "s".charCodeAt(0);
var pngDataTable;
function createPngDataTable() {
  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}
function calcCrc(uint8Array) {
  let c = -1;
  if (!pngDataTable)
    pngDataTable = createPngDataTable();
  for (let n = 0; n < uint8Array.length; n++) {
    c = pngDataTable[(c ^ uint8Array[n]) & 255] ^ c >>> 8;
  }
  return c ^ -1;
}
function searchStartOfPhys(uint8Array) {
  const length = uint8Array.length - 1;
  for (let i = length; i >= 4; i--) {
    if (uint8Array[i - 4] === 9 && uint8Array[i - 3] === _P && uint8Array[i - 2] === _H && uint8Array[i - 1] === _Y && uint8Array[i] === _S) {
      return i - 3;
    }
  }
  return 0;
}
function changePngDpi(uint8Array, dpi, overwritepHYs = false) {
  const physChunk = new Uint8Array(13);
  dpi *= 39.3701;
  physChunk[0] = _P;
  physChunk[1] = _H;
  physChunk[2] = _Y;
  physChunk[3] = _S;
  physChunk[4] = dpi >>> 24;
  physChunk[5] = dpi >>> 16;
  physChunk[6] = dpi >>> 8;
  physChunk[7] = dpi & 255;
  physChunk[8] = physChunk[4];
  physChunk[9] = physChunk[5];
  physChunk[10] = physChunk[6];
  physChunk[11] = physChunk[7];
  physChunk[12] = 1;
  const crc = calcCrc(physChunk);
  const crcChunk = new Uint8Array(4);
  crcChunk[0] = crc >>> 24;
  crcChunk[1] = crc >>> 16;
  crcChunk[2] = crc >>> 8;
  crcChunk[3] = crc & 255;
  if (overwritepHYs) {
    const startingIndex = searchStartOfPhys(uint8Array);
    uint8Array.set(physChunk, startingIndex);
    uint8Array.set(crcChunk, startingIndex + 13);
    return uint8Array;
  } else {
    const chunkLength = new Uint8Array(4);
    chunkLength[0] = 0;
    chunkLength[1] = 0;
    chunkLength[2] = 0;
    chunkLength[3] = 9;
    const finalHeader = new Uint8Array(54);
    finalHeader.set(uint8Array, 0);
    finalHeader.set(chunkLength, 33);
    finalHeader.set(physChunk, 37);
    finalHeader.set(crcChunk, 50);
    return finalHeader;
  }
}
var PREFIX = "[modern-screenshot]";
var IN_BROWSER = typeof window !== "undefined";
var SUPPORT_WEB_WORKER = IN_BROWSER && "Worker" in window;
var SUPPORT_ATOB = IN_BROWSER && "atob" in window;
var SUPPORT_BTOA = IN_BROWSER && "btoa" in window;
var USER_AGENT = IN_BROWSER ? window.navigator?.userAgent : "";
var IN_CHROME = USER_AGENT.includes("Chrome");
var IN_SAFARI = USER_AGENT.includes("AppleWebKit") && !IN_CHROME;
var IN_FIREFOX = USER_AGENT.includes("Firefox");
var isContext = (value) => value && "__CONTEXT__" in value;
var isCssFontFaceRule = (rule) => rule.constructor.name === "CSSFontFaceRule";
var isCSSImportRule = (rule) => rule.constructor.name === "CSSImportRule";
var isLayerBlockRule = (rule) => rule.constructor.name === "CSSLayerBlockRule";
var isElementNode = (node) => node.nodeType === 1;
var isSVGElementNode = (node) => typeof node.className === "object";
var isSVGImageElementNode = (node) => node.tagName === "image";
var isSVGUseElementNode = (node) => node.tagName === "use";
var isHTMLElementNode = (node) => isElementNode(node) && typeof node.style !== "undefined" && !isSVGElementNode(node);
var isCommentNode = (node) => node.nodeType === 8;
var isTextNode = (node) => node.nodeType === 3;
var isImageElement = (node) => node.tagName === "IMG";
var isVideoElement = (node) => node.tagName === "VIDEO";
var isCanvasElement = (node) => node.tagName === "CANVAS";
var isTextareaElement = (node) => node.tagName === "TEXTAREA";
var isInputElement = (node) => node.tagName === "INPUT";
var isStyleElement = (node) => node.tagName === "STYLE";
var isScriptElement = (node) => node.tagName === "SCRIPT";
var isSelectElement = (node) => node.tagName === "SELECT";
var isSlotElement = (node) => node.tagName === "SLOT";
var isIFrameElement = (node) => node.tagName === "IFRAME";
var consoleWarn = (...args) => console.warn(PREFIX, ...args);
function supportWebp(ownerDocument) {
  const canvas = ownerDocument?.createElement?.("canvas");
  if (canvas) {
    canvas.height = canvas.width = 1;
  }
  return Boolean(canvas) && "toDataURL" in canvas && Boolean(canvas.toDataURL("image/webp").includes("image/webp"));
}
var isDataUrl = (url) => url.startsWith("data:");
function resolveUrl(url, baseUrl) {
  if (url.match(/^[a-z]+:\/\//i))
    return url;
  if (IN_BROWSER && url.match(/^\/\//))
    return window.location.protocol + url;
  if (url.match(/^[a-z]+:/i))
    return url;
  if (!IN_BROWSER)
    return url;
  const doc = getDocument().implementation.createHTMLDocument();
  const base = doc.createElement("base");
  const a = doc.createElement("a");
  doc.head.appendChild(base);
  doc.body.appendChild(a);
  if (baseUrl)
    base.href = baseUrl;
  a.href = url;
  return a.href;
}
function getDocument(target) {
  return (target && isElementNode(target) ? target?.ownerDocument : target) ?? window.document;
}
var XMLNS = "http://www.w3.org/2000/svg";
function createSvg(width, height, ownerDocument) {
  const svg = getDocument(ownerDocument).createElementNS(XMLNS, "svg");
  svg.setAttributeNS(null, "width", width.toString());
  svg.setAttributeNS(null, "height", height.toString());
  svg.setAttributeNS(null, "viewBox", `0 0 ${width} ${height}`);
  return svg;
}
function svgToDataUrl(svg, removeControlCharacter) {
  let xhtml = new XMLSerializer().serializeToString(svg);
  if (removeControlCharacter) {
    xhtml = xhtml.replace(/[\u0000-\u0008\v\f\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/gu, "");
  }
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xhtml)}`;
}
async function canvasToBlob(canvas, type = "image/png", quality = 1) {
  try {
    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Blob is null"));
        }
      }, type, quality);
    });
  } catch (error) {
    if (SUPPORT_ATOB) {
      return dataUrlToBlob(canvas.toDataURL(type, quality));
    }
    throw error;
  }
}
function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const type = header.match(/data:(.+);/)?.[1] ?? void 0;
  const decoded = window.atob(base64);
  const length = decoded.length;
  const buffer = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    buffer[i] = decoded.charCodeAt(i);
  }
  return new Blob([buffer], { type });
}
function readBlob(blob, type) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error(`Failed read blob to ${type}`));
    if (type === "dataUrl") {
      reader.readAsDataURL(blob);
    } else if (type === "arrayBuffer") {
      reader.readAsArrayBuffer(blob);
    }
  });
}
var blobToDataUrl = (blob) => readBlob(blob, "dataUrl");
var blobToArrayBuffer = (blob) => readBlob(blob, "arrayBuffer");
function createImage(url, ownerDocument) {
  const img = getDocument(ownerDocument).createElement("img");
  img.decoding = "sync";
  img.loading = "eager";
  img.src = url;
  return img;
}
function loadMedia(media, options) {
  return new Promise((resolve) => {
    const { timeout, ownerDocument, onError: userOnError, onWarn } = options ?? {};
    const node = typeof media === "string" ? createImage(media, getDocument(ownerDocument)) : media;
    let timer = null;
    let removeEventListeners = null;
    function onResolve() {
      resolve(node);
      timer && clearTimeout(timer);
      removeEventListeners?.();
    }
    if (timeout) {
      timer = setTimeout(onResolve, timeout);
    }
    if (isVideoElement(node)) {
      const currentSrc = node.currentSrc || node.src;
      if (!currentSrc) {
        if (node.poster) {
          return loadMedia(node.poster, options).then(resolve);
        }
        return onResolve();
      }
      if (node.readyState >= 2) {
        return onResolve();
      }
      const onLoadeddata = onResolve;
      const onError = (error) => {
        onWarn?.(
          "Failed video load",
          currentSrc,
          error
        );
        userOnError?.(error);
        onResolve();
      };
      removeEventListeners = () => {
        node.removeEventListener("loadeddata", onLoadeddata);
        node.removeEventListener("error", onError);
      };
      node.addEventListener("loadeddata", onLoadeddata, { once: true });
      node.addEventListener("error", onError, { once: true });
    } else {
      const currentSrc = isSVGImageElementNode(node) ? node.href.baseVal : node.currentSrc || node.src;
      if (!currentSrc) {
        return onResolve();
      }
      const onLoad = async () => {
        if (isImageElement(node) && "decode" in node) {
          try {
            await node.decode();
          } catch (error) {
            onWarn?.(
              "Failed to decode image, trying to render anyway",
              node.dataset.originalSrc || currentSrc,
              error
            );
          }
        }
        onResolve();
      };
      const onError = (error) => {
        onWarn?.(
          "Failed image load",
          node.dataset.originalSrc || currentSrc,
          error
        );
        onResolve();
      };
      if (isImageElement(node) && node.complete) {
        return onLoad();
      }
      removeEventListeners = () => {
        node.removeEventListener("load", onLoad);
        node.removeEventListener("error", onError);
      };
      node.addEventListener("load", onLoad, { once: true });
      node.addEventListener("error", onError, { once: true });
    }
  });
}
async function waitUntilLoad(node, options) {
  if (isHTMLElementNode(node)) {
    if (isImageElement(node) || isVideoElement(node)) {
      await loadMedia(node, options);
    } else {
      await Promise.all(
        ["img", "video"].flatMap((selectors) => {
          return Array.from(node.querySelectorAll(selectors)).map((el) => loadMedia(el, options));
        })
      );
    }
  }
}
var uuid = /* @__PURE__ */ function uuid2() {
  let counter = 0;
  const random = () => `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4);
  return () => {
    counter += 1;
    return `u${random()}${counter}`;
  };
}();
function splitFontFamily(fontFamily) {
  return fontFamily?.split(",").map((val) => val.trim().replace(/"|'/g, "").toLowerCase()).filter(Boolean);
}
var uid = 0;
function createLogger(debug) {
  const prefix = `${PREFIX}[#${uid}]`;
  uid++;
  return {
    // eslint-disable-next-line no-console
    time: (label) => debug && console.time(`${prefix} ${label}`),
    // eslint-disable-next-line no-console
    timeEnd: (label) => debug && console.timeEnd(`${prefix} ${label}`),
    warn: (...args) => debug && consoleWarn(...args)
  };
}
function getDefaultRequestInit(bypassingCache) {
  return {
    cache: bypassingCache ? "no-cache" : "force-cache"
  };
}
async function orCreateContext(node, options) {
  return isContext(node) ? node : createContext(node, { ...options, autoDestruct: true });
}
async function createContext(node, options) {
  const { scale = 1, workerUrl, workerNumber = 1 } = options || {};
  const debug = Boolean(options?.debug);
  const features = options?.features ?? true;
  const ownerDocument = node.ownerDocument ?? (IN_BROWSER ? window.document : void 0);
  const ownerWindow = node.ownerDocument?.defaultView ?? (IN_BROWSER ? window : void 0);
  const requests = /* @__PURE__ */ new Map();
  const context = {
    // Options
    width: 0,
    height: 0,
    quality: 1,
    type: "image/png",
    scale,
    backgroundColor: null,
    style: null,
    filter: null,
    maximumCanvasSize: 0,
    timeout: 3e4,
    progress: null,
    debug,
    fetch: {
      requestInit: getDefaultRequestInit(options?.fetch?.bypassingCache),
      placeholderImage: "data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      bypassingCache: false,
      ...options?.fetch
    },
    fetchFn: null,
    font: {},
    drawImageInterval: 100,
    workerUrl: null,
    workerNumber,
    onCloneEachNode: null,
    onCloneNode: null,
    onEmbedNode: null,
    onCreateForeignObjectSvg: null,
    includeStyleProperties: null,
    autoDestruct: false,
    ...options,
    // InternalContext
    __CONTEXT__: true,
    log: createLogger(debug),
    node,
    ownerDocument,
    ownerWindow,
    dpi: scale === 1 ? null : 96 * scale,
    svgStyleElement: createStyleElement(ownerDocument),
    svgDefsElement: ownerDocument?.createElementNS(XMLNS, "defs"),
    svgStyles: /* @__PURE__ */ new Map(),
    defaultComputedStyles: /* @__PURE__ */ new Map(),
    workers: [
      ...Array.from({
        length: SUPPORT_WEB_WORKER && workerUrl && workerNumber ? workerNumber : 0
      })
    ].map(() => {
      try {
        const worker = new Worker(workerUrl);
        worker.onmessage = async (event) => {
          const { url, result } = event.data;
          if (result) {
            requests.get(url)?.resolve?.(result);
          } else {
            requests.get(url)?.reject?.(new Error(`Error receiving message from worker: ${url}`));
          }
        };
        worker.onmessageerror = (event) => {
          const { url } = event.data;
          requests.get(url)?.reject?.(new Error(`Error receiving message from worker: ${url}`));
        };
        return worker;
      } catch (error) {
        context.log.warn("Failed to new Worker", error);
        return null;
      }
    }).filter(Boolean),
    fontFamilies: /* @__PURE__ */ new Map(),
    fontCssTexts: /* @__PURE__ */ new Map(),
    acceptOfImage: `${[
      supportWebp(ownerDocument) && "image/webp",
      "image/svg+xml",
      "image/*",
      "*/*"
    ].filter(Boolean).join(",")};q=0.8`,
    requests,
    drawImageCount: 0,
    tasks: [],
    features,
    isEnable: (key) => {
      if (key === "restoreScrollPosition") {
        return typeof features === "boolean" ? false : features[key] ?? false;
      }
      if (typeof features === "boolean") {
        return features;
      }
      return features[key] ?? true;
    },
    shadowRoots: []
  };
  context.log.time("wait until load");
  await waitUntilLoad(node, { timeout: context.timeout, onWarn: context.log.warn });
  context.log.timeEnd("wait until load");
  const { width, height } = resolveBoundingBox(node, context);
  context.width = width;
  context.height = height;
  return context;
}
function createStyleElement(ownerDocument) {
  if (!ownerDocument)
    return void 0;
  const style = ownerDocument.createElement("style");
  const cssText = style.ownerDocument.createTextNode(`
.______background-clip--text {
  background-clip: text;
  -webkit-background-clip: text;
}
`);
  style.appendChild(cssText);
  return style;
}
function resolveBoundingBox(node, context) {
  let { width, height } = context;
  if (isElementNode(node) && (!width || !height)) {
    const box = node.getBoundingClientRect();
    width = width || box.width || Number(node.getAttribute("width")) || 0;
    height = height || box.height || Number(node.getAttribute("height")) || 0;
  }
  return { width, height };
}
async function imageToCanvas(image, context) {
  const {
    log,
    timeout,
    drawImageCount,
    drawImageInterval
  } = context;
  log.time("image to canvas");
  const loaded = await loadMedia(image, { timeout, onWarn: context.log.warn });
  const { canvas, context2d } = createCanvas(image.ownerDocument, context);
  const drawImage = () => {
    try {
      context2d?.drawImage(loaded, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      context.log.warn("Failed to drawImage", error);
    }
  };
  drawImage();
  if (context.isEnable("fixSvgXmlDecode")) {
    for (let i = 0; i < drawImageCount; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          context2d?.clearRect(0, 0, canvas.width, canvas.height);
          drawImage();
          resolve();
        }, i + drawImageInterval);
      });
    }
  }
  context.drawImageCount = 0;
  log.timeEnd("image to canvas");
  return canvas;
}
function createCanvas(ownerDocument, context) {
  const { width, height, scale, backgroundColor, maximumCanvasSize: max } = context;
  const canvas = ownerDocument.createElement("canvas");
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  if (max) {
    if (canvas.width > max || canvas.height > max) {
      if (canvas.width > max && canvas.height > max) {
        if (canvas.width > canvas.height) {
          canvas.height *= max / canvas.width;
          canvas.width = max;
        } else {
          canvas.width *= max / canvas.height;
          canvas.height = max;
        }
      } else if (canvas.width > max) {
        canvas.height *= max / canvas.width;
        canvas.width = max;
      } else {
        canvas.width *= max / canvas.height;
        canvas.height = max;
      }
    }
  }
  const context2d = canvas.getContext("2d");
  if (context2d && backgroundColor) {
    context2d.fillStyle = backgroundColor;
    context2d.fillRect(0, 0, canvas.width, canvas.height);
  }
  return { canvas, context2d };
}
function cloneCanvas(canvas, context) {
  if (canvas.ownerDocument) {
    try {
      const dataURL = canvas.toDataURL();
      if (dataURL !== "data:,") {
        return createImage(dataURL, canvas.ownerDocument);
      }
    } catch (error) {
      context.log.warn("Failed to clone canvas", error);
    }
  }
  const cloned = canvas.cloneNode(false);
  const ctx = canvas.getContext("2d");
  const clonedCtx = cloned.getContext("2d");
  try {
    if (ctx && clonedCtx) {
      clonedCtx.putImageData(
        ctx.getImageData(0, 0, canvas.width, canvas.height),
        0,
        0
      );
    }
    return cloned;
  } catch (error) {
    context.log.warn("Failed to clone canvas", error);
  }
  return cloned;
}
function cloneIframe(iframe, context) {
  try {
    if (iframe?.contentDocument?.documentElement) {
      return cloneNode(iframe.contentDocument.documentElement, context);
    }
  } catch (error) {
    context.log.warn("Failed to clone iframe", error);
  }
  return iframe.cloneNode(false);
}
function cloneImage(image) {
  const cloned = image.cloneNode(false);
  if (image.currentSrc && image.currentSrc !== image.src) {
    cloned.src = image.currentSrc;
    cloned.srcset = "";
  }
  if (cloned.loading === "lazy") {
    cloned.loading = "eager";
  }
  return cloned;
}
async function cloneVideo(video, context) {
  if (video.ownerDocument && !video.currentSrc && video.poster) {
    return createImage(video.poster, video.ownerDocument);
  }
  const cloned = video.cloneNode(false);
  cloned.crossOrigin = "anonymous";
  if (video.currentSrc && video.currentSrc !== video.src) {
    cloned.src = video.currentSrc;
  }
  const ownerDocument = cloned.ownerDocument;
  if (ownerDocument) {
    let canPlay = true;
    await loadMedia(cloned, { onError: () => canPlay = false, onWarn: context.log.warn });
    if (!canPlay) {
      if (video.poster) {
        return createImage(video.poster, video.ownerDocument);
      }
      return cloned;
    }
    cloned.currentTime = video.currentTime;
    await new Promise((resolve) => {
      cloned.addEventListener("seeked", resolve, { once: true });
    });
    const canvas = ownerDocument.createElement("canvas");
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;
    try {
      const ctx = canvas.getContext("2d");
      if (ctx)
        ctx.drawImage(cloned, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      context.log.warn("Failed to clone video", error);
      if (video.poster) {
        return createImage(video.poster, video.ownerDocument);
      }
      return cloned;
    }
    return cloneCanvas(canvas, context);
  }
  return cloned;
}
function cloneElement(node, context) {
  if (isCanvasElement(node)) {
    return cloneCanvas(node, context);
  }
  if (isIFrameElement(node)) {
    return cloneIframe(node, context);
  }
  if (isImageElement(node)) {
    return cloneImage(node);
  }
  if (isVideoElement(node)) {
    return cloneVideo(node, context);
  }
  return node.cloneNode(false);
}
function getSandBox(context) {
  let sandbox = context.sandbox;
  if (!sandbox) {
    const { ownerDocument } = context;
    try {
      if (ownerDocument) {
        sandbox = ownerDocument.createElement("iframe");
        sandbox.id = `__SANDBOX__${uuid()}`;
        sandbox.width = "0";
        sandbox.height = "0";
        sandbox.style.visibility = "hidden";
        sandbox.style.position = "fixed";
        ownerDocument.body.appendChild(sandbox);
        sandbox.srcdoc = '<!DOCTYPE html><meta charset="UTF-8"><title></title><body>';
        context.sandbox = sandbox;
      }
    } catch (error) {
      context.log.warn("Failed to getSandBox", error);
    }
  }
  return sandbox;
}
var ignoredStyles = [
  "width",
  "height",
  "-webkit-text-fill-color"
];
var includedAttributes = [
  "stroke",
  "fill"
];
function getDefaultStyle(node, pseudoElement, context) {
  const { defaultComputedStyles } = context;
  const nodeName = node.nodeName.toLowerCase();
  const isSvgNode = isSVGElementNode(node) && nodeName !== "svg";
  const attributes = isSvgNode ? includedAttributes.map((name) => [name, node.getAttribute(name)]).filter(([, value]) => value !== null) : [];
  const key = [
    isSvgNode && "svg",
    nodeName,
    attributes.map((name, value) => `${name}=${value}`).join(","),
    pseudoElement
  ].filter(Boolean).join(":");
  if (defaultComputedStyles.has(key))
    return defaultComputedStyles.get(key);
  const sandbox = getSandBox(context);
  const sandboxWindow = sandbox?.contentWindow;
  if (!sandboxWindow)
    return /* @__PURE__ */ new Map();
  const sandboxDocument = sandboxWindow?.document;
  let root;
  let el;
  if (isSvgNode) {
    root = sandboxDocument.createElementNS(XMLNS, "svg");
    el = root.ownerDocument.createElementNS(root.namespaceURI, nodeName);
    attributes.forEach(([name, value]) => {
      el.setAttributeNS(null, name, value);
    });
    root.appendChild(el);
  } else {
    root = el = sandboxDocument.createElement(nodeName);
  }
  el.textContent = " ";
  sandboxDocument.body.appendChild(root);
  const computedStyle = sandboxWindow.getComputedStyle(el, pseudoElement);
  const styles = /* @__PURE__ */ new Map();
  for (let len = computedStyle.length, i = 0; i < len; i++) {
    const name = computedStyle.item(i);
    if (ignoredStyles.includes(name))
      continue;
    styles.set(name, computedStyle.getPropertyValue(name));
  }
  sandboxDocument.body.removeChild(root);
  defaultComputedStyles.set(key, styles);
  return styles;
}
function getDiffStyle(style, defaultStyle, includeStyleProperties) {
  const diffStyle = /* @__PURE__ */ new Map();
  const prefixs = [];
  const prefixTree = /* @__PURE__ */ new Map();
  if (includeStyleProperties) {
    for (const name of includeStyleProperties) {
      applyTo(name);
    }
  } else {
    for (let len = style.length, i = 0; i < len; i++) {
      const name = style.item(i);
      applyTo(name);
    }
  }
  for (let len = prefixs.length, i = 0; i < len; i++) {
    prefixTree.get(prefixs[i])?.forEach((value, name) => diffStyle.set(name, value));
  }
  function applyTo(name) {
    const value = style.getPropertyValue(name);
    const priority = style.getPropertyPriority(name);
    const subIndex = name.lastIndexOf("-");
    const prefix = subIndex > -1 ? name.substring(0, subIndex) : void 0;
    if (prefix) {
      let map = prefixTree.get(prefix);
      if (!map) {
        map = /* @__PURE__ */ new Map();
        prefixTree.set(prefix, map);
      }
      map.set(name, [value, priority]);
    }
    if (defaultStyle.get(name) === value && !priority)
      return;
    if (prefix) {
      prefixs.push(prefix);
    } else {
      diffStyle.set(name, [value, priority]);
    }
  }
  return diffStyle;
}
function copyCssStyles(node, cloned, isRoot, context) {
  const { ownerWindow, includeStyleProperties, currentParentNodeStyle } = context;
  const clonedStyle = cloned.style;
  const computedStyle = ownerWindow.getComputedStyle(node);
  const defaultStyle = getDefaultStyle(node, null, context);
  currentParentNodeStyle?.forEach((_, key) => {
    defaultStyle.delete(key);
  });
  const style = getDiffStyle(computedStyle, defaultStyle, includeStyleProperties);
  style.delete("transition-property");
  style.delete("all");
  style.delete("d");
  style.delete("content");
  if (isRoot) {
    style.delete("position");
    style.delete("margin-top");
    style.delete("margin-right");
    style.delete("margin-bottom");
    style.delete("margin-left");
    style.delete("margin-block-start");
    style.delete("margin-block-end");
    style.delete("margin-inline-start");
    style.delete("margin-inline-end");
    style.set("box-sizing", ["border-box", ""]);
  }
  if (style.get("background-clip")?.[0] === "text") {
    cloned.classList.add("______background-clip--text");
  }
  if (IN_CHROME) {
    if (!style.has("font-kerning"))
      style.set("font-kerning", ["normal", ""]);
    if ((style.get("overflow-x")?.[0] === "hidden" || style.get("overflow-y")?.[0] === "hidden") && style.get("text-overflow")?.[0] === "ellipsis" && node.scrollWidth === node.clientWidth) {
      style.set("text-overflow", ["clip", ""]);
    }
  }
  for (let len = clonedStyle.length, i = 0; i < len; i++) {
    clonedStyle.removeProperty(clonedStyle.item(i));
  }
  style.forEach(([value, priority], name) => {
    clonedStyle.setProperty(name, value, priority);
  });
  return style;
}
function copyInputValue(node, cloned) {
  if (isTextareaElement(node) || isInputElement(node) || isSelectElement(node)) {
    cloned.setAttribute("value", node.value);
  }
}
var pseudoClasses = [
  "::before",
  "::after"
  // '::placeholder', TODO
];
var scrollbarPseudoClasses = [
  "::-webkit-scrollbar",
  "::-webkit-scrollbar-button",
  // '::-webkit-scrollbar:horizontal', TODO
  "::-webkit-scrollbar-thumb",
  "::-webkit-scrollbar-track",
  "::-webkit-scrollbar-track-piece",
  // '::-webkit-scrollbar:vertical', TODO
  "::-webkit-scrollbar-corner",
  "::-webkit-resizer"
];
function copyPseudoClass(node, cloned, copyScrollbar, context, addWordToFontFamilies) {
  const { ownerWindow, svgStyleElement, svgStyles, currentNodeStyle } = context;
  if (!svgStyleElement || !ownerWindow)
    return;
  function copyBy(pseudoClass) {
    const computedStyle = ownerWindow.getComputedStyle(node, pseudoClass);
    let content = computedStyle.getPropertyValue("content");
    if (!content || content === "none")
      return;
    addWordToFontFamilies?.(content);
    content = content.replace(/(')|(")|(counter\(.+\))/g, "");
    const klasses = [uuid()];
    const defaultStyle = getDefaultStyle(node, pseudoClass, context);
    currentNodeStyle?.forEach((_, key) => {
      defaultStyle.delete(key);
    });
    const style = getDiffStyle(computedStyle, defaultStyle, context.includeStyleProperties);
    style.delete("content");
    style.delete("-webkit-locale");
    if (style.get("background-clip")?.[0] === "text") {
      cloned.classList.add("______background-clip--text");
    }
    const cloneStyle = [
      `content: '${content}';`
    ];
    style.forEach(([value, priority], name) => {
      cloneStyle.push(`${name}: ${value}${priority ? " !important" : ""};`);
    });
    if (cloneStyle.length === 1)
      return;
    try {
      cloned.className = [cloned.className, ...klasses].join(" ");
    } catch (err) {
      context.log.warn("Failed to copyPseudoClass", err);
      return;
    }
    const cssText = cloneStyle.join("\n  ");
    let allClasses = svgStyles.get(cssText);
    if (!allClasses) {
      allClasses = [];
      svgStyles.set(cssText, allClasses);
    }
    allClasses.push(`.${klasses[0]}${pseudoClass}`);
  }
  pseudoClasses.forEach(copyBy);
  if (copyScrollbar)
    scrollbarPseudoClasses.forEach(copyBy);
}
var excludeParentNodes = /* @__PURE__ */ new Set([
  "symbol"
  // test/fixtures/svg.symbol.html
]);
async function appendChildNode(node, cloned, child, context, addWordToFontFamilies) {
  if (isElementNode(child) && (isStyleElement(child) || isScriptElement(child)))
    return;
  if (context.filter && !context.filter(child))
    return;
  if (excludeParentNodes.has(cloned.nodeName) || excludeParentNodes.has(child.nodeName)) {
    context.currentParentNodeStyle = void 0;
  } else {
    context.currentParentNodeStyle = context.currentNodeStyle;
  }
  const childCloned = await cloneNode(child, context, false, addWordToFontFamilies);
  if (context.isEnable("restoreScrollPosition")) {
    restoreScrollPosition(node, childCloned);
  }
  cloned.appendChild(childCloned);
}
async function cloneChildNodes(node, cloned, context, addWordToFontFamilies) {
  let firstChild = node.firstChild;
  if (isElementNode(node)) {
    if (node.shadowRoot) {
      firstChild = node.shadowRoot?.firstChild;
      context.shadowRoots.push(node.shadowRoot);
    }
  }
  for (let child = firstChild; child; child = child.nextSibling) {
    if (isCommentNode(child))
      continue;
    if (isElementNode(child) && isSlotElement(child) && typeof child.assignedNodes === "function") {
      const nodes = child.assignedNodes();
      for (let i = 0; i < nodes.length; i++) {
        await appendChildNode(node, cloned, nodes[i], context, addWordToFontFamilies);
      }
    } else {
      await appendChildNode(node, cloned, child, context, addWordToFontFamilies);
    }
  }
}
function restoreScrollPosition(node, chlidCloned) {
  if (!isHTMLElementNode(node) || !isHTMLElementNode(chlidCloned))
    return;
  const { scrollTop, scrollLeft } = node;
  if (!scrollTop && !scrollLeft) {
    return;
  }
  const { transform } = chlidCloned.style;
  const matrix = new DOMMatrix(transform);
  const { a, b, c, d } = matrix;
  matrix.a = 1;
  matrix.b = 0;
  matrix.c = 0;
  matrix.d = 1;
  matrix.translateSelf(-scrollLeft, -scrollTop);
  matrix.a = a;
  matrix.b = b;
  matrix.c = c;
  matrix.d = d;
  chlidCloned.style.transform = matrix.toString();
}
function applyCssStyleWithOptions(cloned, context) {
  const { backgroundColor, width, height, style: styles } = context;
  const clonedStyle = cloned.style;
  if (backgroundColor)
    clonedStyle.setProperty("background-color", backgroundColor, "important");
  if (width)
    clonedStyle.setProperty("width", `${width}px`, "important");
  if (height)
    clonedStyle.setProperty("height", `${height}px`, "important");
  if (styles) {
    for (const name in styles) clonedStyle[name] = styles[name];
  }
}
var NORMAL_ATTRIBUTE_RE = /^[\w-:]+$/;
async function cloneNode(node, context, isRoot = false, addWordToFontFamilies) {
  const { ownerDocument, ownerWindow, fontFamilies, onCloneEachNode } = context;
  if (ownerDocument && isTextNode(node)) {
    if (addWordToFontFamilies && /\S/.test(node.data)) {
      addWordToFontFamilies(node.data);
    }
    return ownerDocument.createTextNode(node.data);
  }
  if (ownerDocument && ownerWindow && isElementNode(node) && (isHTMLElementNode(node) || isSVGElementNode(node))) {
    const cloned2 = await cloneElement(node, context);
    if (context.isEnable("removeAbnormalAttributes")) {
      const names = cloned2.getAttributeNames();
      for (let len = names.length, i = 0; i < len; i++) {
        const name = names[i];
        if (!NORMAL_ATTRIBUTE_RE.test(name)) {
          cloned2.removeAttribute(name);
        }
      }
    }
    const style = context.currentNodeStyle = copyCssStyles(node, cloned2, isRoot, context);
    if (isRoot)
      applyCssStyleWithOptions(cloned2, context);
    let copyScrollbar = false;
    if (context.isEnable("copyScrollbar")) {
      const overflow = [
        style.get("overflow-x")?.[0],
        style.get("overflow-y")?.[0]
      ];
      copyScrollbar = overflow.includes("scroll") || (overflow.includes("auto") || overflow.includes("overlay")) && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth);
    }
    const textTransform = style.get("text-transform")?.[0];
    const families = splitFontFamily(style.get("font-family")?.[0]);
    const addWordToFontFamilies2 = families ? (word) => {
      if (textTransform === "uppercase") {
        word = word.toUpperCase();
      } else if (textTransform === "lowercase") {
        word = word.toLowerCase();
      } else if (textTransform === "capitalize") {
        word = word[0].toUpperCase() + word.substring(1);
      }
      families.forEach((family) => {
        let fontFamily = fontFamilies.get(family);
        if (!fontFamily) {
          fontFamilies.set(family, fontFamily = /* @__PURE__ */ new Set());
        }
        word.split("").forEach((text) => fontFamily.add(text));
      });
    } : void 0;
    copyPseudoClass(
      node,
      cloned2,
      copyScrollbar,
      context,
      addWordToFontFamilies2
    );
    copyInputValue(node, cloned2);
    if (!isVideoElement(node)) {
      await cloneChildNodes(
        node,
        cloned2,
        context,
        addWordToFontFamilies2
      );
    }
    await onCloneEachNode?.(cloned2);
    return cloned2;
  }
  const cloned = node.cloneNode(false);
  await cloneChildNodes(node, cloned, context);
  await onCloneEachNode?.(cloned);
  return cloned;
}
function destroyContext(context) {
  context.ownerDocument = void 0;
  context.ownerWindow = void 0;
  context.svgStyleElement = void 0;
  context.svgDefsElement = void 0;
  context.svgStyles.clear();
  context.defaultComputedStyles.clear();
  if (context.sandbox) {
    try {
      context.sandbox.remove();
    } catch (err) {
      context.log.warn("Failed to destroyContext", err);
    }
    context.sandbox = void 0;
  }
  context.workers = [];
  context.fontFamilies.clear();
  context.fontCssTexts.clear();
  context.requests.clear();
  context.tasks = [];
  context.shadowRoots = [];
}
function baseFetch(options) {
  const { url, timeout, responseType, ...requestInit } = options;
  const controller = new AbortController();
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : void 0;
  return fetch(url, { signal: controller.signal, ...requestInit }).then((response) => {
    if (!response.ok) {
      throw new Error("Failed fetch, not 2xx response", { cause: response });
    }
    switch (responseType) {
      case "arrayBuffer":
        return response.arrayBuffer();
      case "dataUrl":
        return response.blob().then(blobToDataUrl);
      case "text":
      default:
        return response.text();
    }
  }).finally(() => clearTimeout(timer));
}
function contextFetch(context, options) {
  const { url: rawUrl, requestType = "text", responseType = "text", imageDom } = options;
  let url = rawUrl;
  const {
    timeout,
    acceptOfImage,
    requests,
    fetchFn,
    fetch: {
      requestInit,
      bypassingCache,
      placeholderImage
    },
    font,
    workers,
    fontFamilies
  } = context;
  if (requestType === "image" && (IN_SAFARI || IN_FIREFOX)) {
    context.drawImageCount++;
  }
  let request = requests.get(rawUrl);
  if (!request) {
    if (bypassingCache) {
      if (bypassingCache instanceof RegExp && bypassingCache.test(url)) {
        url += (/\?/.test(url) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime();
      }
    }
    const canFontMinify = requestType.startsWith("font") && font && font.minify;
    const fontTexts = /* @__PURE__ */ new Set();
    if (canFontMinify) {
      const families = requestType.split(";")[1].split(",");
      families.forEach((family) => {
        if (!fontFamilies.has(family))
          return;
        fontFamilies.get(family).forEach((text) => fontTexts.add(text));
      });
    }
    const needFontMinify = canFontMinify && fontTexts.size;
    const baseFetchOptions = {
      url,
      timeout,
      responseType: needFontMinify ? "arrayBuffer" : responseType,
      headers: requestType === "image" ? { accept: acceptOfImage } : void 0,
      ...requestInit
    };
    request = {
      type: requestType,
      resolve: void 0,
      reject: void 0,
      response: null
    };
    request.response = (async () => {
      if (fetchFn && requestType === "image") {
        const result = await fetchFn(rawUrl);
        if (result)
          return result;
      }
      if (!IN_SAFARI && rawUrl.startsWith("http") && workers.length) {
        return new Promise((resolve, reject) => {
          const worker = workers[requests.size & workers.length - 1];
          worker.postMessage({ rawUrl, ...baseFetchOptions });
          request.resolve = resolve;
          request.reject = reject;
        });
      }
      return baseFetch(baseFetchOptions);
    })().catch((error) => {
      requests.delete(rawUrl);
      if (requestType === "image" && placeholderImage) {
        context.log.warn("Failed to fetch image base64, trying to use placeholder image", url);
        return typeof placeholderImage === "string" ? placeholderImage : placeholderImage(imageDom);
      }
      throw error;
    });
    requests.set(rawUrl, request);
  }
  return request.response;
}
async function replaceCssUrlToDataUrl(cssText, baseUrl, context, isImage) {
  if (!hasCssUrl(cssText))
    return cssText;
  for (const [rawUrl, url] of parseCssUrls(cssText, baseUrl)) {
    try {
      const dataUrl = await contextFetch(
        context,
        {
          url,
          requestType: isImage ? "image" : "text",
          responseType: "dataUrl"
        }
      );
      cssText = cssText.replace(toRE(rawUrl), `$1${dataUrl}$3`);
    } catch (error) {
      context.log.warn("Failed to fetch css data url", rawUrl, error);
    }
  }
  return cssText;
}
function hasCssUrl(cssText) {
  return /url\((['"]?)([^'"]+?)\1\)/.test(cssText);
}
var URL_RE = /url\((['"]?)([^'"]+?)\1\)/g;
function parseCssUrls(cssText, baseUrl) {
  const result = [];
  cssText.replace(URL_RE, (raw, quotation, url) => {
    result.push([url, resolveUrl(url, baseUrl)]);
    return raw;
  });
  return result.filter(([url]) => !isDataUrl(url));
}
function toRE(url) {
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
  return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, "g");
}
var properties = [
  "background-image",
  "border-image-source",
  "-webkit-border-image",
  "-webkit-mask-image",
  "list-style-image"
];
function embedCssStyleImage(style, context) {
  return properties.map((property) => {
    const value = style.getPropertyValue(property);
    if (!value || value === "none") {
      return null;
    }
    if (IN_SAFARI || IN_FIREFOX) {
      context.drawImageCount++;
    }
    return replaceCssUrlToDataUrl(value, null, context, true).then((newValue) => {
      if (!newValue || value === newValue)
        return;
      style.setProperty(
        property,
        newValue,
        style.getPropertyPriority(property)
      );
    });
  }).filter(Boolean);
}
function embedImageElement(cloned, context) {
  if (isImageElement(cloned)) {
    const originalSrc = cloned.currentSrc || cloned.src;
    if (!isDataUrl(originalSrc)) {
      return [
        contextFetch(context, {
          url: originalSrc,
          imageDom: cloned,
          requestType: "image",
          responseType: "dataUrl"
        }).then((url) => {
          if (!url)
            return;
          cloned.srcset = "";
          cloned.dataset.originalSrc = originalSrc;
          cloned.src = url || "";
        })
      ];
    }
    if (IN_SAFARI || IN_FIREFOX) {
      context.drawImageCount++;
    }
  } else if (isSVGElementNode(cloned) && !isDataUrl(cloned.href.baseVal)) {
    const originalSrc = cloned.href.baseVal;
    return [
      contextFetch(context, {
        url: originalSrc,
        imageDom: cloned,
        requestType: "image",
        responseType: "dataUrl"
      }).then((url) => {
        if (!url)
          return;
        cloned.dataset.originalSrc = originalSrc;
        cloned.href.baseVal = url || "";
      })
    ];
  }
  return [];
}
function embedSvgUse(cloned, context) {
  const { ownerDocument, svgDefsElement } = context;
  const href = cloned.getAttribute("href") ?? cloned.getAttribute("xlink:href");
  if (!href)
    return [];
  const [svgUrl, id] = href.split("#");
  if (id) {
    const query = `#${id}`;
    const definition = context.shadowRoots.reduce(
      (res, root) => {
        return res ?? root.querySelector(`svg ${query}`);
      },
      ownerDocument?.querySelector(`svg ${query}`)
    );
    if (svgUrl) {
      cloned.setAttribute("href", query);
    }
    if (svgDefsElement?.querySelector(query))
      return [];
    if (definition) {
      svgDefsElement?.appendChild(definition.cloneNode(true));
      return [];
    } else if (svgUrl) {
      return [
        contextFetch(context, {
          url: svgUrl,
          responseType: "text"
        }).then((svgData) => {
          svgDefsElement?.insertAdjacentHTML("beforeend", svgData);
        })
      ];
    }
  }
  return [];
}
function embedNode(cloned, context) {
  const { tasks } = context;
  if (isElementNode(cloned)) {
    if (isImageElement(cloned) || isSVGImageElementNode(cloned)) {
      tasks.push(...embedImageElement(cloned, context));
    }
    if (isSVGUseElementNode(cloned)) {
      tasks.push(...embedSvgUse(cloned, context));
    }
  }
  if (isHTMLElementNode(cloned)) {
    tasks.push(...embedCssStyleImage(cloned.style, context));
  }
  cloned.childNodes.forEach((child) => {
    embedNode(child, context);
  });
}
async function embedWebFont(clone, context) {
  const {
    ownerDocument,
    svgStyleElement,
    fontFamilies,
    fontCssTexts,
    tasks,
    font
  } = context;
  if (!ownerDocument || !svgStyleElement || !fontFamilies.size) {
    return;
  }
  if (font && font.cssText) {
    const cssText = filterPreferredFormat(font.cssText, context);
    svgStyleElement.appendChild(ownerDocument.createTextNode(`${cssText}
`));
  } else {
    const styleSheets = Array.from(ownerDocument.styleSheets).filter((styleSheet) => {
      try {
        return "cssRules" in styleSheet && Boolean(styleSheet.cssRules.length);
      } catch (error) {
        context.log.warn(`Error while reading CSS rules from ${styleSheet.href}`, error);
        return false;
      }
    });
    const tempDoc = ownerDocument.implementation.createHTMLDocument("");
    const tempStyleEl = tempDoc.createElement("style");
    tempDoc.head.appendChild(tempStyleEl);
    const tempStyleSheet = tempStyleEl.sheet;
    await Promise.all(
      styleSheets.flatMap((styleSheet) => {
        return Array.from(styleSheet.cssRules).map(async (cssRule) => {
          if (isCSSImportRule(cssRule)) {
            const baseUrl = cssRule.href;
            let cssText = "";
            try {
              cssText = await contextFetch(context, {
                url: baseUrl,
                requestType: "text",
                responseType: "text"
              });
            } catch (error) {
              context.log.warn(`Error fetch remote css import from ${baseUrl}`, error);
            }
            const replacedCssText = cssText.replace(
              URL_RE,
              (raw, quotation, url) => raw.replace(url, resolveUrl(url, baseUrl))
            );
            for (const rule of parseCss(replacedCssText)) {
              try {
                tempStyleSheet.insertRule(rule, tempStyleSheet.cssRules.length);
              } catch (error) {
                context.log.warn("Error inserting rule from remote css import", { rule, error });
              }
            }
          }
        });
      })
    );
    if (tempStyleSheet.cssRules.length)
      styleSheets.push(tempStyleSheet);
    const cssRules = [];
    styleSheets.forEach((sheet) => {
      unwrapCssLayers(sheet.cssRules, cssRules);
    });
    cssRules.filter((cssRule) => isCssFontFaceRule(cssRule) && hasCssUrl(cssRule.style.getPropertyValue("src")) && splitFontFamily(cssRule.style.getPropertyValue("font-family"))?.some((val) => fontFamilies.has(val))).forEach((value) => {
      const rule = value;
      const cssText = fontCssTexts.get(rule.cssText);
      if (cssText) {
        svgStyleElement.appendChild(ownerDocument.createTextNode(`${cssText}
`));
      } else {
        tasks.push(
          replaceCssUrlToDataUrl(
            rule.cssText,
            rule.parentStyleSheet ? rule.parentStyleSheet.href : null,
            context
          ).then((cssText2) => {
            cssText2 = filterPreferredFormat(cssText2, context);
            fontCssTexts.set(rule.cssText, cssText2);
            svgStyleElement.appendChild(ownerDocument.createTextNode(`${cssText2}
`));
          })
        );
      }
    });
  }
}
var COMMENTS_RE = /(\/\*[\s\S]*?\*\/)/g;
var KEYFRAMES_RE = /((@.*?keyframes [\s\S]*?){([\s\S]*?}\s*?)})/gi;
function parseCss(source) {
  if (source == null)
    return [];
  const result = [];
  let cssText = source.replace(COMMENTS_RE, "");
  while (true) {
    const matches = KEYFRAMES_RE.exec(cssText);
    if (!matches)
      break;
    result.push(matches[0]);
  }
  cssText = cssText.replace(KEYFRAMES_RE, "");
  const IMPORT_RE = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
  const UNIFIED_RE = new RegExp(
    // eslint-disable-next-line
    "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})",
    "gi"
  );
  while (true) {
    let matches = IMPORT_RE.exec(cssText);
    if (!matches) {
      matches = UNIFIED_RE.exec(cssText);
      if (!matches) {
        break;
      } else {
        IMPORT_RE.lastIndex = UNIFIED_RE.lastIndex;
      }
    } else {
      UNIFIED_RE.lastIndex = IMPORT_RE.lastIndex;
    }
    result.push(matches[0]);
  }
  return result;
}
var URL_WITH_FORMAT_RE = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
var FONT_SRC_RE = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
function filterPreferredFormat(str, context) {
  const { font } = context;
  const preferredFormat = font ? font?.preferredFormat : void 0;
  return preferredFormat ? str.replace(FONT_SRC_RE, (match) => {
    while (true) {
      const [src, , format] = URL_WITH_FORMAT_RE.exec(match) || [];
      if (!format)
        return "";
      if (format === preferredFormat)
        return `src: ${src};`;
    }
  }) : str;
}
function unwrapCssLayers(rules, out = []) {
  for (const rule of Array.from(rules)) {
    if (isLayerBlockRule(rule)) {
      out.push(...unwrapCssLayers(rule.cssRules));
    } else if ("cssRules" in rule) {
      unwrapCssLayers(rule.cssRules, out);
    } else {
      out.push(rule);
    }
  }
  return out;
}
var SVG_EXTERNAL_RESOURCE_REGEX = /\bx?link:?href\s*=\s*["'](?!data:)[^"']+["']/i;
function svgHasExternalResources(svg) {
  return SVG_EXTERNAL_RESOURCE_REGEX.test(svg.innerHTML);
}
async function domToForeignObjectSvg(node, options) {
  const context = await orCreateContext(node, options);
  if (isElementNode(context.node) && isSVGElementNode(context.node) && !svgHasExternalResources(context.node))
    return context.node;
  const {
    ownerDocument,
    log,
    tasks,
    svgStyleElement,
    svgDefsElement,
    svgStyles,
    font,
    progress,
    autoDestruct,
    onCloneNode,
    onEmbedNode,
    onCreateForeignObjectSvg
  } = context;
  log.time("clone node");
  const clone = await cloneNode(context.node, context, true);
  if (svgStyleElement && ownerDocument) {
    let allCssText = "";
    svgStyles.forEach((klasses, cssText) => {
      allCssText += `${klasses.join(",\n")} {
  ${cssText}
}
`;
    });
    svgStyleElement.appendChild(ownerDocument.createTextNode(allCssText));
  }
  log.timeEnd("clone node");
  await onCloneNode?.(clone);
  if (font !== false && isElementNode(clone)) {
    log.time("embed web font");
    await embedWebFont(clone, context);
    log.timeEnd("embed web font");
  }
  log.time("embed node");
  embedNode(clone, context);
  const count = tasks.length;
  let current = 0;
  const runTask = async () => {
    while (true) {
      const task = tasks.pop();
      if (!task)
        break;
      try {
        await task;
      } catch (error) {
        context.log.warn("Failed to run task", error);
      }
      progress?.(++current, count);
    }
  };
  progress?.(current, count);
  await Promise.all([...Array.from({ length: 4 })].map(runTask));
  log.timeEnd("embed node");
  await onEmbedNode?.(clone);
  const svg = createForeignObjectSvg(clone, context);
  svgDefsElement && svg.insertBefore(svgDefsElement, svg.children[0]);
  svgStyleElement && svg.insertBefore(svgStyleElement, svg.children[0]);
  autoDestruct && destroyContext(context);
  await onCreateForeignObjectSvg?.(svg);
  return svg;
}
function createForeignObjectSvg(clone, context) {
  const { width, height } = context;
  const svg = createSvg(width, height, clone.ownerDocument);
  const foreignObject = svg.ownerDocument.createElementNS(svg.namespaceURI, "foreignObject");
  foreignObject.setAttributeNS(null, "x", "0%");
  foreignObject.setAttributeNS(null, "y", "0%");
  foreignObject.setAttributeNS(null, "width", "100%");
  foreignObject.setAttributeNS(null, "height", "100%");
  foreignObject.append(clone);
  svg.appendChild(foreignObject);
  return svg;
}
async function domToCanvas(node, options) {
  const context = await orCreateContext(node, options);
  const svg = await domToForeignObjectSvg(context);
  const dataUrl = svgToDataUrl(svg, context.isEnable("removeControlCharacter"));
  if (!context.autoDestruct) {
    context.svgStyleElement = createStyleElement(context.ownerDocument);
    context.svgDefsElement = context.ownerDocument?.createElementNS(XMLNS, "defs");
    context.svgStyles.clear();
  }
  const image = createImage(dataUrl, svg.ownerDocument);
  return await imageToCanvas(image, context);
}
async function domToBlob(node, options) {
  const context = await orCreateContext(node, options);
  const { log, type, quality, dpi } = context;
  const canvas = await domToCanvas(context);
  log.time("canvas to blob");
  const blob = await canvasToBlob(canvas, type, quality);
  if (["image/png", "image/jpeg"].includes(type) && dpi) {
    const arrayBuffer = await blobToArrayBuffer(blob.slice(0, 33));
    let uint8Array = new Uint8Array(arrayBuffer);
    if (type === "image/png") {
      uint8Array = changePngDpi(uint8Array, dpi);
    } else if (type === "image/jpeg") {
      uint8Array = changeJpegDpi(uint8Array, dpi);
    }
    log.timeEnd("canvas to blob");
    return new Blob([uint8Array, blob.slice(33)], { type });
  }
  log.timeEnd("canvas to blob");
  return blob;
}

// src/main.ts
var PREVIEW_SELECTORS = ".markdown-preview-view, .markdown-reading-view, .cm-content";
var MAX_CANVAS_HEIGHT = 3e4;
var MOBILE_MAX_CANVAS_HEIGHT = 16e3;
var DESKTOP_IMAGE_TIMEOUT_MS = 3e3;
var MOBILE_IMAGE_TIMEOUT_MS = 800;
var DESKTOP_FONT_TIMEOUT_MS = 1e3;
var MOBILE_FONT_TIMEOUT_MS = 300;
var DESKTOP_SCALE = 2;
var MOBILE_SCALE = 1.25;
var SCREENSHOT_FOLDER = "Attachments/Screenshots";
var DEFAULT_SETTINGS = {
  watermark: {
    enabled: false,
    text: "@HWY1dot0",
    style: "corner",
    corner: "bottom-right",
    opacity: 0.5,
    fontSize: 14,
    color: ""
  }
};
var ScreenshotSelectionPlugin = class extends import_obsidian.Plugin {
  settings;
  // Last non-collapsed selection inside a rendered note, stashed continuously so
  // capture survives the selection loss when a menu/ribbon is tapped on mobile.
  // Cloning this LIVE DOM is what makes iOS rasterize correctly — a freshly
  // MarkdownRenderer-rendered offscreen subtree comes back blank.
  lastPreviewRange = null;
  async onload() {
    await this.loadSettings();
    this.registerDomEvent(activeDocument, "selectionchange", () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
      const range = sel.getRangeAt(0);
      if (nodeAsElement(range.commonAncestorContainer)?.closest(PREVIEW_SELECTORS)) {
        this.lastPreviewRange = range.cloneRange();
      }
    });
    this.addCommand({
      id: "capture-selection-as-png",
      name: import_obsidian.Platform.isMobile ? "Capture selection or block" : "Capture selection to clipboard",
      callback: () => {
        void this.captureActive(import_obsidian.Platform.isMobile ? "auto" : "clipboard");
      }
    });
    if (!import_obsidian.Platform.isMobile) {
      this.addCommand({
        id: "capture-selection-as-png-file",
        name: "Capture selection or block to file",
        callback: () => {
          void this.captureActive("file");
        }
      });
    }
    this.addRibbonIcon("camera", import_obsidian.Platform.isMobile ? "Screenshot selection or block" : "Screenshot selection", () => {
      void this.captureActive(import_obsidian.Platform.isMobile ? "auto" : "clipboard");
    });
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, _editor, info) => {
        const viewAtMenuOpen = info instanceof import_obsidian.MarkdownView ? info : this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
        const snapshot = viewAtMenuOpen ? getEditorMarkdownSnapshot(_editor, viewAtMenuOpen.file?.path ?? "") : null;
        menu.addItem((item) => {
          item.setTitle(import_obsidian.Platform.isMobile ? "Screenshot selection/block" : "Screenshot selection/block to file").setIcon("camera").onClick(() => {
            const view = viewAtMenuOpen ?? this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
            if (!view) {
              new import_obsidian.Notice("Open a markdown note first");
              return;
            }
            if (import_obsidian.Platform.isMobile) {
              void this.capture(view, "auto");
              return;
            }
            if (snapshot) {
              void this.captureMarkdownSnapshot(view, snapshot, "file");
              return;
            }
            void this.capture(view, "file");
          });
        });
      })
    );
    this.addSettingTab(new ScreenshotSelectionSettingTab(this.app, this));
  }
  async loadSettings() {
    const data = await this.loadData();
    this.settings = {
      watermark: Object.assign(
        {},
        DEFAULT_SETTINGS.watermark,
        data?.watermark
      )
    };
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  // Current selection if it is live and inside a note, otherwise the last one
  // stashed before a tap collapsed it.
  getEffectiveSelectionRange() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      if (nodeAsElement(range.commonAncestorContainer)?.closest(PREVIEW_SELECTORS)) {
        return range;
      }
    }
    return this.lastPreviewRange;
  }
  async captureActive(output) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian.MarkdownView);
    if (!view) {
      new import_obsidian.Notice("Open a markdown note first");
      return;
    }
    await this.capture(view, output);
  }
  async capture(view, output) {
    const sourcePromise = output === "clipboard" ? Promise.resolve(buildDomSelectionSource(view, import_obsidian.Platform.isMobile)) : buildFileSource(this, view);
    await this.captureFromSource(view, sourcePromise, output);
  }
  async captureMarkdownSnapshot(view, snapshot, output) {
    await this.captureFromSource(
      view,
      buildSnapshotSource(this, snapshot, import_obsidian.Platform.isMobile),
      output
    );
  }
  async captureFromSource(view, sourcePromise, output) {
    if (output === "auto") {
      await this.captureAutoFromSource(view, sourcePromise);
      return;
    }
    try {
      const source = await sourcePromise;
      if (!source) {
        new import_obsidian.Notice(output === "file" ? "No note content to capture" : "No content selected");
        return;
      }
      const result = await this.createCaptureResultFromSource(source);
      if (output === "clipboard") {
        await writeBlobToClipboard(result.blob);
        new import_obsidian.Notice("Copied selection as image", 2e3);
        return;
      }
      await this.saveCaptureResult(view, result);
    } catch (e) {
      showCaptureError(e);
    }
  }
  async captureAutoFromSource(view, sourcePromise) {
    const progress = new import_obsidian.Notice("Capturing screenshot...", 0);
    try {
      const source = await sourcePromise;
      if (!source) {
        new import_obsidian.Notice("No note content to capture");
        return;
      }
      const result = await this.createCaptureResultFromSource(source);
      const modeNote = result.renderMode === "fallback" ? " (text fallback \u2014 iOS could not rasterize)" : result.renderMode === "dom" ? " (themed render)" : "";
      try {
        await writeBlobToClipboard(result.blob);
        new import_obsidian.Notice(`Copied screenshot to clipboard${modeNote}`, 2500);
      } catch (e) {
        console.warn("[screenshot-selection] mobile clipboard write failed, saving to vault", e);
        await this.saveCaptureResult(view, result, `Saved screenshot and inserted link${modeNote}`);
      }
    } catch (e) {
      showCaptureError(e);
    } finally {
      progress.hide();
    }
  }
  async createCaptureResultFromSource(source) {
    let offscreen = null;
    try {
      offscreen = source.offscreen;
      activeDocument.body.appendChild(offscreen);
      await waitForAssets(offscreen);
      await waitForPaint();
      trimOffscreenToContent(offscreen);
      const inner = offscreen.firstElementChild;
      const maxHeight = import_obsidian.Platform.isMobile ? MOBILE_MAX_CANVAS_HEIGHT : MAX_CANVAS_HEIGHT;
      if (inner.offsetHeight > maxHeight) {
        throw new Error(`Selection too tall (${inner.offsetHeight}px). Select less and retry.`);
      }
      const bg = getComputedStyle(activeDocument.body).getPropertyValue("--background-primary").trim() || "#ffffff";
      const scale = import_obsidian.Platform.isMobile ? MOBILE_SCALE : DESKTOP_SCALE;
      const wm = this.settings.watermark;
      const useWatermark = wm.enabled && wm.text.trim().length > 0;
      let renderMode;
      let blob;
      if (import_obsidian.Platform.isMobile) {
        const mobile = await renderMobileCaptureBlob(offscreen, bg, scale, useWatermark ? wm : null, source.fallbackMarkdown);
        blob = mobile.blob;
        renderMode = mobile.usedFallback ? "fallback" : "dom";
      } else {
        blob = useWatermark ? await captureWithWatermark(offscreen, bg, wm, scale) : await domToBlob(offscreen, { scale, type: "image/png", backgroundColor: bg });
      }
      if (!blob) {
        throw new Error("Capture failed: empty image");
      }
      return {
        blob,
        insertAfter: source.insertAfter,
        renderMode
      };
    } finally {
      offscreen?.remove();
      source.component?.unload();
    }
  }
  async saveCaptureResult(view, result, insertedNotice = "Saved screenshot and inserted link") {
    const file = await saveBlobToVault(this.app, result.blob, view);
    const inserted = insertFileLink(view, file, result.insertAfter);
    new import_obsidian.Notice(inserted ? insertedNotice : `Saved screenshot to ${file.path}`, 3e3);
  }
};
async function buildFileSource(plugin, view) {
  if (import_obsidian.Platform.isMobile) {
    const range = plugin.getEffectiveSelectionRange();
    if (range) {
      const domSource = buildRangeSource(range, true);
      if (domSource) return domSource;
    }
    const editorSelectionSource = await buildEditorMarkdownSource(plugin, view, true);
    if (editorSelectionSource) return editorSelectionSource;
    const editorSource = await buildEditorMarkdownSource(plugin, view);
    if (editorSource) return editorSource;
    return null;
  }
  if (view.getMode() === "source") {
    const editorSource = await buildEditorMarkdownSource(plugin, view);
    if (editorSource) return editorSource;
  }
  const selectionSource = buildDomSelectionSource(view, import_obsidian.Platform.isMobile, true);
  if (selectionSource) return selectionSource;
  return buildVisibleViewSource(view, import_obsidian.Platform.isMobile);
}
async function buildEditorMarkdownSource(plugin, view, selectionOnly = false) {
  const editor = view.editor;
  if (!editor) return null;
  const snapshot = getEditorMarkdownSnapshot(editor, view.file?.path ?? "", selectionOnly);
  if (!snapshot) return null;
  return buildSnapshotSource(plugin, snapshot, import_obsidian.Platform.isMobile);
}
async function buildSnapshotSource(plugin, snapshot, mobile) {
  const component = new import_obsidian.Component();
  component.load();
  try {
    return {
      offscreen: await buildMarkdownOffscreen(plugin, snapshot.markdown, snapshot.sourcePath, mobile, component),
      insertAfter: snapshot.insertAfter,
      fallbackMarkdown: snapshot.markdown,
      component
    };
  } catch (e) {
    component.unload();
    throw e;
  }
}
function getEditorMarkdownSnapshot(editor, sourcePath, selectionOnly = false) {
  const selectedMarkdown = editor.getSelection();
  if (selectedMarkdown.trim()) {
    return {
      markdown: selectedMarkdown,
      sourcePath,
      insertAfter: editor.getCursor("to")
    };
  }
  if (selectionOnly) return null;
  const block = getCurrentMarkdownBlock(editor);
  if (!block?.markdown.trim()) return null;
  return {
    markdown: block.markdown,
    sourcePath,
    insertAfter: block.end
  };
}
function buildRangeSource(range, mobile) {
  const anchor = nodeAsElement(range.commonAncestorContainer);
  if (!anchor?.closest(PREVIEW_SELECTORS)) return null;
  return {
    offscreen: buildSelectionOffscreen(range, mobile),
    fallbackMarkdown: range.toString().replace(/\n{3,}/g, "\n\n").trim()
  };
}
function buildDomSelectionSource(view, mobile, quiet = false) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  const anchor = nodeAsElement(range.commonAncestorContainer);
  const previewRoot = anchor?.closest(PREVIEW_SELECTORS);
  if (!previewRoot) {
    if (!quiet) {
      if (view.getMode() === "source") {
        new import_obsidian.Notice("Switch to Live Preview or Reading view to capture");
      } else {
        new import_obsidian.Notice("Selection is outside the document");
      }
    }
    return null;
  }
  const fallbackMarkdown = range.toString().replace(/\n{3,}/g, "\n\n").trim();
  return {
    offscreen: buildSelectionOffscreen(range, mobile),
    fallbackMarkdown
  };
}
function buildVisibleViewSource(view, mobile) {
  const root = view.containerEl.querySelector(PREVIEW_SELECTORS);
  if (!root) return null;
  const wrap = createCaptureWrap(mobile);
  const inner = createRenderedInner();
  inner.appendChild(root.cloneNode(true));
  wrap.appendChild(inner);
  return { offscreen: wrap };
}
async function buildMarkdownOffscreen(plugin, markdown, sourcePath, mobile, component) {
  const wrap = createCaptureWrap(mobile);
  const inner = createRenderedInner();
  wrap.appendChild(inner);
  await import_obsidian.MarkdownRenderer.render(plugin.app, markdown, inner, sourcePath, component);
  return wrap;
}
function getCurrentMarkdownBlock(editor) {
  const cursor = editor.getCursor();
  const lastLine = editor.lastLine();
  const focusLine = getNearestNonEmptyLine(editor, cursor.line);
  if (focusLine === null) return null;
  let startLine = focusLine;
  let endLine = focusLine;
  while (startLine > 0 && editor.getLine(startLine - 1).trim()) {
    startLine -= 1;
  }
  while (endLine < lastLine && editor.getLine(endLine + 1).trim()) {
    endLine += 1;
  }
  const end = {
    line: endLine,
    ch: editor.getLine(endLine).length
  };
  return {
    markdown: editor.getRange({ line: startLine, ch: 0 }, end),
    end
  };
}
function getNearestNonEmptyLine(editor, line) {
  if (editor.getLine(line).trim()) return line;
  const lastLine = editor.lastLine();
  const maxDistance = Math.min(4, Math.max(line, lastLine - line));
  for (let distance = 1; distance <= maxDistance; distance += 1) {
    const before = line - distance;
    if (before >= 0 && editor.getLine(before).trim()) return before;
    const after = line + distance;
    if (after <= lastLine && editor.getLine(after).trim()) return after;
  }
  return null;
}
function nodeAsElement(node) {
  return node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
}
function createCaptureWrap(mobile) {
  const wrap = activeDocument.createElement("div");
  wrap.className = "screenshot-selection-capture";
  wrap.style.cssText = [
    "position: fixed",
    `left: ${mobile ? "8px" : "-10000px"}`,
    `top: ${mobile ? "calc(env(safe-area-inset-top, 0px) + 8px)" : "0"}`,
    `z-index: ${mobile ? "2147483647" : "-1"}`,
    "pointer-events: none",
    "height: auto",
    `width: ${mobile ? "min(390px, calc(100vw - 32px))" : "var(--file-line-width, 760px)"}`,
    `max-width: ${mobile ? "390px" : "900px"}`,
    "background: var(--background-primary)",
    "color: var(--text-normal)",
    `padding: ${mobile ? "18px 20px" : "28px 32px"}`,
    "box-sizing: border-box",
    "font-family: var(--font-text)",
    "font-size: var(--font-text-size, 16px)",
    "line-height: var(--line-height-normal)"
  ].join(";");
  return wrap;
}
function createRenderedInner() {
  const inner = activeDocument.createElement("div");
  inner.className = "markdown-preview-view markdown-rendered show-indentation-guide screenshot-selection-inner";
  inner.style.cssText = [
    "width: 100%",
    "height: auto",
    "min-height: 0",
    "max-height: none",
    "padding: 0",
    "margin: 0",
    "overflow: visible"
  ].join(";");
  return inner;
}
function buildSelectionOffscreen(range, mobile) {
  const wrap = createCaptureWrap(mobile);
  const inner = createRenderedInner();
  inner.appendChild(range.cloneContents());
  wrap.appendChild(inner);
  return wrap;
}
async function waitForAssets(root) {
  try {
    await withTimeout(activeDocument.fonts.ready, import_obsidian.Platform.isMobile ? MOBILE_FONT_TIMEOUT_MS : DESKTOP_FONT_TIMEOUT_MS);
  } catch {
  }
  const imgs = Array.from(root.querySelectorAll("img"));
  const imageTimeout = import_obsidian.Platform.isMobile ? MOBILE_IMAGE_TIMEOUT_MS : DESKTOP_IMAGE_TIMEOUT_MS;
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve(null);
      return Promise.race([
        img.decode().catch(() => null),
        new Promise((r) => window.setTimeout(r, imageTimeout))
      ]);
    })
  );
}
function trimOffscreenToContent(offscreen) {
  const inner = offscreen.firstElementChild;
  if (!inner) return;
  const contentHeight = measureContentHeight(inner);
  if (contentHeight <= 0) return;
  inner.style.height = `${contentHeight}px`;
}
function measureContentHeight(container) {
  const containerTop = container.getBoundingClientRect().top;
  let bottom = 0;
  for (const child of Array.from(container.children)) {
    if (child.tagName === "STYLE") continue;
    const rect = child.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    const style = getComputedStyle(child);
    const marginBottom = parseFloat(style.marginBottom) || 0;
    bottom = Math.max(bottom, rect.bottom - containerTop + marginBottom);
  }
  return Math.ceil(bottom);
}
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => window.setTimeout(() => resolve(null), ms))
  ]);
}
async function waitForPaint() {
  await nextAnimationFrame();
  if (import_obsidian.Platform.isMobile) {
    await nextAnimationFrame();
  }
}
function nextAnimationFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
}
async function renderMobileCaptureBlob(offscreen, bg, scale, wm, fallbackMarkdown) {
  try {
    const canvas = await domToCanvas(offscreen, { scale, backgroundColor: bg });
    if (!isCanvasBlank(canvas)) {
      if (wm?.text.trim()) {
        const effScale = offscreen.offsetWidth > 0 ? canvas.width / offscreen.offsetWidth : scale;
        drawWatermark(canvas, wm, effScale);
      }
      const blob = await canvasToBlob2(canvas);
      if (blob) return { blob, usedFallback: false };
    } else {
      console.warn("[screenshot-selection] mobile DOM rasterize came back blank, using canvas fallback");
    }
  } catch (e) {
    console.warn("[screenshot-selection] mobile DOM rasterize failed, using canvas fallback", e);
  }
  if (fallbackMarkdown?.trim()) {
    return { blob: await renderMarkdownCanvasBlob(fallbackMarkdown, wm), usedFallback: true };
  }
  return { blob: await domToBlob(offscreen, { scale, type: "image/png", backgroundColor: bg }), usedFallback: true };
}
function isCanvasBlank(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  if (w === 0 || h === 0) return true;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return false;
  let ref;
  try {
    ref = ctx.getImageData(0, 0, 1, 1).data;
  } catch {
    return false;
  }
  const tol = 12;
  const stripeRows = 64;
  for (let y = 0; y < h; y += stripeRows) {
    const rows = Math.min(stripeRows, h - y);
    let data;
    try {
      data = ctx.getImageData(0, y, w, rows).data;
    } catch {
      return false;
    }
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (Math.abs(a - ref[3]) > tol) return false;
      if (a < 8) continue;
      if (Math.abs(data[i] - ref[0]) > tol || Math.abs(data[i + 1] - ref[1]) > tol || Math.abs(data[i + 2] - ref[2]) > tol) {
        return false;
      }
    }
  }
  return true;
}
async function renderMarkdownCanvasBlob(markdown, wm) {
  const theme = getCanvasTheme();
  const scale = Math.min(Math.max(window.devicePixelRatio || 2, 1.5), 2.5);
  const cssWidth = Math.min(390, Math.max(320, window.innerWidth - 24));
  const paddingX = 22;
  const paddingY = 20;
  const contentWidth = cssWidth - paddingX * 2;
  const measureCanvas = activeDocument.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  if (!measureCtx) throw new Error("Canvas unavailable");
  const rows = layoutMarkdownCanvasRows(markdown, measureCtx, theme, paddingX, paddingY, contentWidth);
  const lastRow = rows[rows.length - 1];
  const cssHeight = Math.max(80, Math.ceil((lastRow ? lastRow.y + lastRow.lineHeight : paddingY) + paddingY));
  const canvas = activeDocument.createElement("canvas");
  canvas.width = Math.ceil(cssWidth * scale);
  canvas.height = Math.ceil(cssHeight * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, cssWidth, cssHeight);
  for (const row of rows) {
    if (row.background) {
      ctx.fillStyle = row.background;
      ctx.fillRect(paddingX - 8, row.y - row.fontSize - 4, contentWidth + 16, row.lineHeight + 4);
    }
    if (row.accent) {
      ctx.fillStyle = row.accent;
      ctx.fillRect(paddingX - 10, row.y - row.fontSize - 2, 3, row.lineHeight + 2);
    }
    ctx.fillStyle = row.color;
    ctx.font = `${row.fontWeight} ${row.fontSize}px ${row.fontFamily}`;
    ctx.textBaseline = "alphabetic";
    ctx.fillText(row.text, row.x, row.y, row.maxWidth);
  }
  ctx.restore();
  if (wm?.text.trim()) {
    drawWatermark(canvas, wm, scale);
  }
  return await canvasToBlob2(canvas);
}
function layoutMarkdownCanvasRows(markdown, ctx, theme, paddingX, paddingY, contentWidth) {
  const rows = [];
  let y = paddingY;
  let inCode = false;
  for (const rawLine of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const fence = rawLine.match(/^\s*```/);
    if (fence) {
      inCode = !inCode;
      y += rows.length ? 8 : 0;
      continue;
    }
    if (!rawLine.trim()) {
      y += 10;
      continue;
    }
    const style = getMarkdownCanvasLineStyle(rawLine, inCode, theme);
    ctx.font = `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
    const wrapped = wrapCanvasText(ctx, style.text, contentWidth - style.indent);
    for (const line of wrapped) {
      y += style.lineHeight;
      rows.push({
        text: line,
        x: paddingX + style.indent,
        y,
        maxWidth: contentWidth - style.indent,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        color: style.color,
        background: style.background,
        accent: style.accent
      });
    }
    y += style.after;
  }
  return rows;
}
function getMarkdownCanvasLineStyle(line, inCode, theme) {
  if (inCode) {
    return {
      text: line.replace(/\t/g, "  "),
      indent: 0,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "400",
      fontFamily: theme.monospaceFont,
      color: theme.text,
      background: theme.codeBackground,
      accent: "",
      after: 0
    };
  }
  const heading = line.match(/^(#{1,6})\s+(.+)$/);
  if (heading) {
    const level = heading[1].length;
    const fontSize = level === 1 ? 24 : level === 2 ? 21 : 18;
    return {
      text: stripInlineMarkdown(heading[2]),
      indent: 0,
      fontSize,
      lineHeight: Math.round(fontSize * 1.35),
      fontWeight: "700",
      fontFamily: theme.font,
      color: theme.text,
      background: "",
      accent: "",
      after: 8
    };
  }
  const quote = line.match(/^\s*>\s?(.*)$/);
  if (quote) {
    return {
      text: stripInlineMarkdown(quote[1].replace(/^\[![^\]]+\]\s*/, "")),
      indent: 8,
      fontSize: 15,
      lineHeight: 22,
      fontWeight: "400",
      fontFamily: theme.font,
      color: theme.text,
      background: "",
      accent: theme.accent,
      after: 2
    };
  }
  const list = line.match(/^\s*([-*+]|\d+[.)])\s+(.+)$/);
  if (list) {
    const marker = /^\d/.test(list[1]) ? `${list[1]} ` : "- ";
    return {
      text: `${marker}${stripInlineMarkdown(list[2].replace(/^\[[ xX]\]\s+/, ""))}`,
      indent: 8,
      fontSize: 16,
      lineHeight: 23,
      fontWeight: "400",
      fontFamily: theme.font,
      color: theme.text,
      background: "",
      accent: "",
      after: 2
    };
  }
  return {
    text: stripInlineMarkdown(line),
    indent: 0,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    fontFamily: theme.font,
    color: theme.text,
    background: "",
    accent: "",
    after: 4
  };
}
function wrapCanvasText(ctx, text, maxWidth) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    if (ctx.measureText(word).width <= maxWidth) {
      current = word;
    } else {
      const broken = breakLongCanvasWord(ctx, word, maxWidth);
      lines.push(...broken.slice(0, -1));
      current = broken[broken.length - 1] ?? "";
    }
  }
  if (current) lines.push(current);
  return lines;
}
function breakLongCanvasWord(ctx, word, maxWidth) {
  const lines = [];
  let current = "";
  for (const ch of Array.from(word)) {
    const candidate = current + ch;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = ch;
  }
  if (current) lines.push(current);
  return lines;
}
function stripInlineMarkdown(text) {
  return text.replace(/!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, alias) => `[image: ${alias || target}]`).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, alias) => alias || target).replace(/!\[([^\]]*)\]\([^)]+\)/g, (_m, alt) => alt ? `[image: ${alt}]` : "[image]").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/(\*\*|__)(.*?)\1/g, "$2").replace(/(\*|_)(.*?)\1/g, "$2").replace(/~~(.*?)~~/g, "$1").replace(/<[^>]+>/g, "").trim();
}
function getCanvasTheme() {
  return {
    background: cssVar("--background-primary", "#ffffff"),
    text: cssVar("--text-normal", "#222222"),
    muted: cssVar("--text-muted", "#666666"),
    accent: cssVar("--interactive-accent", "#7c6df2"),
    codeBackground: cssVar("--code-background", cssVar("--background-secondary", "#f4f4f4")),
    font: cssVar("--font-text", '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'),
    monospaceFont: cssVar("--font-monospace", "ui-monospace, SFMono-Regular, Menlo, monospace")
  };
}
function cssVar(name, fallback) {
  return getComputedStyle(activeDocument.body).getPropertyValue(name).trim() || fallback;
}
function canvasToBlob2(canvas) {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
}
async function captureWithWatermark(offscreen, bg, wm, scale) {
  const canvas = await domToCanvas(offscreen, { scale, backgroundColor: bg });
  const effScale = offscreen.offsetWidth > 0 ? canvas.width / offscreen.offsetWidth : scale;
  drawWatermark(canvas, wm, effScale);
  return await new Promise(
    (resolve) => canvas.toBlob((b) => resolve(b), "image/png")
  );
}
function drawWatermark(canvas, wm, scale) {
  const text = wm.text.trim();
  const ctx = canvas.getContext("2d");
  if (!text || !ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const fontPx = Math.max(1, wm.fontSize) * scale;
  const fontFamily = getComputedStyle(activeDocument.body).getPropertyValue("--font-text").trim() || "sans-serif";
  ctx.save();
  ctx.globalAlpha = clamp(wm.opacity, 0, 1);
  ctx.fillStyle = resolveWatermarkColor(wm.color);
  ctx.font = `${fontPx}px ${fontFamily}`;
  if (wm.style === "tiled") {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-Math.PI / 6);
    const stepX = Math.max(ctx.measureText(text).width + 80 * scale, 160 * scale);
    const stepY = Math.max(fontPx * 4, 80 * scale);
    const reach = Math.sqrt(W * W + H * H);
    for (let y = -reach; y <= reach; y += stepY) {
      for (let x = -reach; x <= reach; x += stepX) {
        ctx.fillText(text, x, y);
      }
    }
  } else {
    const pad = 14 * scale;
    ctx.textBaseline = "alphabetic";
    const isRight = wm.corner.endsWith("right");
    const isBottom = wm.corner.startsWith("bottom");
    ctx.textAlign = isRight ? "right" : "left";
    const x = isRight ? W - pad : pad;
    const y = isBottom ? H - pad : pad + fontPx;
    ctx.fillText(text, x, y);
  }
  ctx.restore();
}
function resolveWatermarkColor(color) {
  const c = color.trim();
  if (c) return c;
  const muted = getComputedStyle(activeDocument.body).getPropertyValue("--text-muted").trim();
  return muted || "#888888";
}
function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}
async function saveBlobToVault(app, blob, view) {
  await ensureFolder(app, SCREENSHOT_FOLDER);
  const noteBaseName = sanitizeFileName(view.file?.basename ?? "note");
  const basePath = (0, import_obsidian.normalizePath)(`${SCREENSHOT_FOLDER}/${noteBaseName}-${timestampForFile()}.png`);
  const path = await getAvailablePath(app, basePath);
  return app.vault.createBinary(path, await blob.arrayBuffer());
}
async function ensureFolder(app, folderPath) {
  const normalized = (0, import_obsidian.normalizePath)(folderPath);
  const parts = normalized.split("/").filter(Boolean);
  let current = "";
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    if (!(app.vault.getAbstractFileByPath(current) instanceof import_obsidian.TFolder)) {
      await app.vault.createFolder(current);
    }
  }
}
async function getAvailablePath(app, path) {
  if (!app.vault.getAbstractFileByPath(path)) return path;
  const extIndex = path.lastIndexOf(".");
  const stem = extIndex >= 0 ? path.slice(0, extIndex) : path;
  const ext = extIndex >= 0 ? path.slice(extIndex) : "";
  for (let i = 2; i < 1e3; i += 1) {
    const candidate = `${stem}-${i}${ext}`;
    if (!app.vault.getAbstractFileByPath(candidate)) return candidate;
  }
  throw new Error("Could not find an available screenshot filename");
}
function insertFileLink(view, file, insertAfter) {
  const editor = view.editor;
  if (!editor || view.getMode() !== "source") return false;
  const sourcePath = view.file?.path ?? "";
  let link = view.app.fileManager.generateMarkdownLink(file, sourcePath);
  if (!link.startsWith("!")) link = `!${link}`;
  const pos = insertAfter ?? editor.getCursor("to");
  const line = editor.getLine(pos.line);
  const prefix = pos.ch === 0 ? "" : "\n";
  const suffix = line.slice(pos.ch).trim() ? "\n" : "";
  editor.replaceRange(`${prefix}${link}
${suffix}`, pos, pos, "screenshot-selection");
  return true;
}
function sanitizeFileName(name) {
  return name.replace(/[\\/:*?"<>|#^[\]]+/g, "-").replace(/\s+/g, " ").trim() || "note";
}
function timestampForFile() {
  const d = /* @__PURE__ */ new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    "-",
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join("");
}
function getElectronClipboardModule() {
  const req = window.require;
  if (typeof req !== "function") return null;
  return req("electron");
}
async function writeBlobToClipboard(blob) {
  try {
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    return;
  } catch (e) {
    console.warn("[screenshot-selection] navigator.clipboard.write failed, falling back to Electron", e);
  }
  const electron = getElectronClipboardModule();
  if (!electron?.clipboard || !electron.nativeImage) {
    throw new Error("Clipboard API unavailable");
  }
  const buf = Buffer.from(await blob.arrayBuffer());
  electron.clipboard.writeImage(electron.nativeImage.createFromBuffer(buf));
}
function showCaptureError(e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("[screenshot-selection]", e);
  new import_obsidian.Notice(`Capture failed: ${msg}`, 4e3);
}
var ScreenshotSelectionSettingTab = class extends import_obsidian.PluginSettingTab {
  plugin;
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const wm = this.plugin.settings.watermark;
    new import_obsidian.Setting(containerEl).setName("Add watermark").setDesc("Draw a watermark onto each captured screenshot.").addToggle(
      (toggle) => toggle.setValue(wm.enabled).onChange(async (value) => {
        wm.enabled = value;
        await this.plugin.saveSettings();
        this.display();
      })
    );
    if (!wm.enabled) {
      return;
    }
    new import_obsidian.Setting(containerEl).setName("Watermark text").addText(
      (text) => text.setPlaceholder("@your-handle").setValue(wm.text).onChange(async (value) => {
        wm.text = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Style").addDropdown(
      (dropdown) => dropdown.addOption("corner", "Corner label").addOption("tiled", "Diagonal tiled").setValue(wm.style).onChange(async (value) => {
        wm.style = value;
        await this.plugin.saveSettings();
        this.display();
      })
    );
    if (wm.style === "corner") {
      new import_obsidian.Setting(containerEl).setName("Corner").addDropdown(
        (dropdown) => dropdown.addOption("top-left", "Top left").addOption("top-right", "Top right").addOption("bottom-left", "Bottom left").addOption("bottom-right", "Bottom right").setValue(wm.corner).onChange(async (value) => {
          wm.corner = value;
          await this.plugin.saveSettings();
        })
      );
    }
    new import_obsidian.Setting(containerEl).setName("Opacity").setDesc("0 = invisible, 1 = solid. Tiled usually looks best around 0.1.").addSlider(
      (slider) => slider.setLimits(0, 1, 0.05).setValue(wm.opacity).setDynamicTooltip().onChange(async (value) => {
        wm.opacity = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Font size (px)").addText(
      (text) => text.setValue(String(wm.fontSize)).onChange(async (value) => {
        const n = Number(value);
        if (Number.isFinite(n) && n > 0) {
          wm.fontSize = n;
          await this.plugin.saveSettings();
        }
      })
    );
    new import_obsidian.Setting(containerEl).setName("Color").setDesc("Leave blank to use the theme muted text color, or set a hex like #888888.").addText(
      (text) => text.setPlaceholder("(theme default)").setValue(wm.color).onChange(async (value) => {
        wm.color = value;
        await this.plugin.saveSettings();
      })
    );
  }
};

/* nosourcemap */