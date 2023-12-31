(function(k, d) {
    "object" === typeof exports && "undefined" !== typeof module ? d(exports, require("three")) : "function" === typeof define && define.amd ? define(["exports", "three"], d) : (k = k || self,
    d(k.PANOLENS = {}, k.THREE))
}
)(this, function(k, d) {
    function Y(a) {
        this.constraints = Object.assign({
            video: {
                width: {
                    ideal: 1920
                },
                height: {
                    ideal: 1080
                },
                facingMode: {
                    exact: "environment"
                }
            },
            audio: !1
        }, a);
        this.element = this.scene = this.container = null;
        this.devices = [];
        this.stream = null;
        this.ratioScalar = 1;
        this.videoDeviceIndex = 0
    }
    function F(a) {
        this.format = null;
        this.eyeSep = void 0 === a ? .064 : a;
        this.loffset = new d.Vector2;
        this.roffset = new d.Vector2
    }
    function J(a, b, c) {
        a = void 0 === a ? 16777215 : a;
        b = void 0 === b ? !0 : b;
        c = void 0 === c ? 1500 : c;
        this.dpr = window.devicePixelRatio;
        var e = this.createCanvas()
          , g = e.canvas;
        e = e.context;
        var h = new d.SpriteMaterial({
            color: a,
            map: this.createCanvasTexture(g)
        });
        d.Sprite.call(this, h);
        this.canvasWidth = g.width;
        this.canvasHeight = g.height;
        this.context = e;
        this.color = a instanceof d.Color ? a : new d.Color(a);
        this.autoSelect = b;
        this.dwellTime = c;
        this.rippleDuration = 500;
        this.position.z = -10;
        this.center.set(.5, .5);
        this.scale.set(.5, .5, 1);
        this.callback = this.timerId = this.startTimestamp = null;
        this.frustumCulled = !1;
        this.updateCanvasArcByProgress(0)
    }
    function y(a, b, c) {
        a = void 0 === a ? 300 : a;
        b = b || t.Info;
        d.Sprite.call(this);
        this.type = "infospot";
        this.animated = void 0 !== c ? c : !0;
        this.frustumCulled = this.isHovering = !1;
        this.cursorStyle = this.toPanorama = this.element = null;
        this.mode = q.NORMAL;
        this.scale.set(a, a, 1);
        this.rotation.y = Math.PI;
        this.container = null;
        this.originalRaycast = this.raycast;
        this.HANDLER_FOCUS = null;
        this.material.side = d.DoubleSide;
        this.material.depthTest = !1;
        this.material.transparent = !0;
        this.material.opacity = 0;
        this.scaleUpAnimation = new m.Tween;
        this.scaleDownAnimation = new m.Tween;
        c = function(b) {
            if (this.material) {
                var e = b.image.width / b.image.height
                  , c = new d.Vector3;
                b.image.width = b.image.naturalWidth || 64;
                b.image.height = b.image.naturalHeight || 64;
                this.scale.set(e * a, a, 1);
                c.copy(this.scale);
                this.scaleUpAnimation = (new m.Tween(this.scale)).to({
                    x: 1.3 * c.x,
                    y: 1.3 * c.y
                }, 500).easing(m.Easing.Elastic.Out);
                this.scaleDownAnimation = (new m.Tween(this.scale)).to({
                    x: c.x,
                    y: c.y
                }, 500).easing(m.Easing.Elastic.Out);
                this.material.map = b;
                this.material.needsUpdate = !0
            }
        }
        .bind(this);
        this.showAnimation = (new m.Tween(this.material)).to({
            opacity: 1
        }, 500).onStart(this.enableRaycast.bind(this, !0)).easing(m.Easing.Quartic.Out);
        this.hideAnimation = (new m.Tween(this.material)).to({
            opacity: 0
        }, 500).onStart(this.enableRaycast.bind(this, !1)).easing(m.Easing.Quartic.Out);
        this.addEventListener("click", this.onClick);
        this.addEventListener("hover", this.onHover);
        this.addEventListener("hoverenter", this.onHoverStart);
        this.addEventListener("hoverleave", this.onHoverEnd);
        this.addEventListener("panolens-dual-eye-effect", this.onDualEyeEffect);
        this.addEventListener("panolens-container", this.setContainer.bind(this));
        this.addEventListener("dismiss", this.onDismiss);
        this.addEventListener("panolens-infospot-focus", this.setFocusMethod);
        K.load(b, c)
    }
    function L(a) {
        a || console.warn("PANOLENS.Widget: No container specified");
        d.EventDispatcher.call(this);
        this.DEFAULT_TRANSITION = "all 0.27s ease";
        this.TOUCH_ENABLED = !!("ontouchstart"in window || window.DocumentTouch && document instanceof DocumentTouch);
        this.PREVENT_EVENT_HANDLER = function(a) {
            a.preventDefault();
            a.stopPropagation()
        }
        ;
        this.container = a;
        this.mask = this.activeSubMenu = this.activeMainItem = this.mainMenu = this.settingElement = this.videoElement = this.fullscreenElement = this.barElement = null
    }
    function r() {
        this.edgeLength = 1E4;
        d.Mesh.call(this, this.createGeometry(this.edgeLength), this.createMaterial());
        this.type = "panorama";
        this.ImageQualityLow = 1;
        this.ImageQualityFair = 2;
        this.ImageQualityMedium = 3;
        this.ImageQualityHigh = 4;
        this.ImageQualitySuperHigh = 5;
        this.animationDuration = 1E3;
        this.defaultInfospotSize = 350;
        this.container = void 0;
        this.loaded = !1;
        this.linkedSpots = [];
        this.isInfospotVisible = !1;
        this.linkingImageScale = this.linkingImageURL = void 0;
        this.renderOrder = -1;
        this.active = !1;
        this.infospotAnimation = (new m.Tween(this)).to({}, this.animationDuration / 2);
        this.addEventListener("load", this.fadeIn.bind(this));
        this.addEventListener("panolens-container", this.setContainer.bind(this));
        this.addEventListener("click", this.onClick.bind(this));
        this.setupTransitions()
    }
    function u(a) {
        r.call(this);
        this.src = a;
        this.type = "image_panorama"
    }
    function R() {
        r.call(this);
        this.type = "empty_panorama"
    }
    function M(a) {
        a = void 0 === a ? [] : a;
        r.call(this);
        this.images = a;
        this.type = "cube_panorama"
    }
    function S() {
        for (var a = [], b = 0; 6 > b; b++)
            a.push(t.WhiteTile);
        M.call(this, a);
        this.type = "basic_panorama"
    }
    function z(a, b) {
        b = void 0 === b ? {} : b;
        r.call(this);
        this.src = a;
        this.options = Object.assign({
            videoElement: document.createElement("video"),
            loop: !0,
            muted: !0,
            autoplay: !1,
            playsinline: !0,
            crossOrigin: "anonymous"
        }, b);
        this.videoElement = this.options.videoElement;
        this.videoProgress = 0;
        this.type = "video_panorama";
        this.addEventListener("leave", this.pauseVideo.bind(this));
        this.addEventListener("enter-fade-start", this.resumeVideoProgress.bind(this));
        this.addEventListener("video-toggle", this.toggleVideo.bind(this));
        this.addEventListener("video-time", this.setVideoCurrentTime.bind(this))
    }
    function Z(a) {
        this._parameters = a = void 0 === a ? {} : a;
        this._panoId = this._zoom = null;
        this._panoClient = new google.maps.StreetViewService;
        this._total = this._count = 0;
        this._canvas = [];
        this._ctx = [];
        this._hc = this._wc = 0;
        this.result = null;
        this.rotation = 0;
        this.copyright = "";
        this.onPanoramaLoad = this.onSizeChange = null;
        this.levelsW = [1, 2, 4, 7, 13, 26];
        this.levelsH = [1, 1, 2, 4, 7, 13];
        this.widths = [416, 832, 1664, 3328, 6656, 13312];
        this.heights = [416, 416, 832, 1664, 3328, 6656];
        this.maxH = this.maxW = 6656;
        var b;
        try {
            var c = document.createElement("canvas");
            (b = c.getContext("experimental-webgl")) || (b = c.getContext("webgl"))
        } catch (e) {}
        this.maxW = Math.max(b.getParameter(b.MAX_TEXTURE_SIZE), this.maxW);
        this.maxH = Math.max(b.getParameter(b.MAX_TEXTURE_SIZE), this.maxH)
    }
    function aa(a, b) {
        u.call(this);
        this.panoId = a;
        this.gsvLoader = null;
        this.loadRequested = !1;
        this.setupGoogleMapAPI(b);
        this.type = "google_streetview_panorama"
    }
    function B(a, b) {
        "image" === (void 0 === a ? "image" : a) && u.call(this, b);
        this.EPS = 1E-6;
        this.frameId = null;
        this.dragging = !1;
        this.userMouse = new d.Vector2;
        this.quatA = new d.Quaternion;
        this.quatB = new d.Quaternion;
        this.quatCur = new d.Quaternion;
        this.quatSlerp = new d.Quaternion;
        this.vectorX = new d.Vector3(1,0,0);
        this.vectorY = new d.Vector3(0,1,0);
        this.type = "little_planet";
        this.addEventListener("window-resize", this.onWindowResize)
    }
    function ba(a) {
        B.call(this, "image", a);
        this.type = "image_little_planet"
    }
    function T(a) {
        r.call(this);
        this.media = new Y(a);
        this.type = "camera_panorama";
        this.addEventListener("enter", this.start.bind(this));
        this.addEventListener("leave", this.stop.bind(this));
        this.addEventListener("panolens-container", this.onPanolensContainer.bind(this));
        this.addEventListener("panolens-scene", this.onPanolensScene.bind(this))
    }
    function N(a, b) {
        b = void 0 === b ? new F : b;
        u.call(this, a);
        this.stereo = b;
        this.type = "stereo_image_panorama"
    }
    function G(a, b, c) {
        b = void 0 === b ? {} : b;
        c = void 0 === c ? new F : c;
        z.call(this, a, b);
        this.stereo = c;
        this.type = "stereo_video_panorama"
    }
    function ca(a, b) {
        function c(a) {
            U = !1;
            O = P = 0;
            if (!1 !== f.enabled) {
                a.preventDefault();
                if (a.button === f.mouseButtons.ORBIT) {
                    if (!0 === f.noRotate)
                        return;
                    w = v.ROTATE;
                    D.set(a.clientX, a.clientY)
                } else if (a.button === f.mouseButtons.ZOOM) {
                    if (!0 === f.noZoom)
                        return;
                    w = v.DOLLY;
                    u.set(a.clientX, a.clientY)
                } else if (a.button === f.mouseButtons.PAN) {
                    if (!0 === f.noPan)
                        return;
                    w = v.PAN;
                    r.set(a.clientX, a.clientY)
                }
                w !== v.NONE && (document.addEventListener("mousemove", e, !1),
                document.addEventListener("mouseup", g, !1),
                f.dispatchEvent(R));
                f.update()
            }
        }
        function e(a) {
            if (!1 !== f.enabled) {
                a.preventDefault();
                var b = f.domElement === document ? f.domElement.body : f.domElement;
                if (w === v.ROTATE) {
                    if (!0 === f.noRotate)
                        return;
                    k.set(a.clientX, a.clientY);
                    m.subVectors(k, D);
                    f.rotateLeft(2 * Math.PI * m.x / b.clientWidth * f.rotateSpeed);
                    f.rotateUp(2 * Math.PI * m.y / b.clientHeight * f.rotateSpeed);
                    D.copy(k);
                    H && (O = a.clientX - H.clientX,
                    P = a.clientY - H.clientY);
                    H = a
                } else if (w === v.DOLLY) {
                    if (!0 === f.noZoom)
                        return;
                    y.set(a.clientX, a.clientY);
                    z.subVectors(y, u);
                    0 < z.y ? f.dollyIn() : 0 > z.y && f.dollyOut();
                    u.copy(y)
                } else if (w === v.PAN) {
                    if (!0 === f.noPan)
                        return;
                    W.set(a.clientX, a.clientY);
                    q.subVectors(W, r);
                    f.pan(q.x, q.y);
                    r.copy(W)
                }
                w !== v.NONE && f.update()
            }
        }
        function g() {
            U = !0;
            H = void 0;
            !1 !== f.enabled && (document.removeEventListener("mousemove", e, !1),
            document.removeEventListener("mouseup", g, !1),
            f.dispatchEvent(S),
            w = v.NONE)
        }
        function h(a) {
            if (!1 !== f.enabled && !0 !== f.noZoom && w === v.NONE) {
                a.preventDefault();
                a.stopPropagation();
                var b = 0;
                void 0 !== a.wheelDelta ? b = a.wheelDelta : void 0 !== a.detail && (b = -a.detail);
                0 < b ? (f.object.fov = f.object.fov < f.maxFov ? f.object.fov + 1 : f.maxFov,
                f.object.updateProjectionMatrix()) : 0 > b && (f.object.fov = f.object.fov > f.minFov ? f.object.fov - 1 : f.minFov,
                f.object.updateProjectionMatrix());
                f.update();
                f.dispatchEvent(X);
                f.dispatchEvent(R);
                f.dispatchEvent(S)
            }
        }
        function p(a) {
            switch (a.keyCode) {
            case f.keys.UP:
                G = !1;
                break;
            case f.keys.BOTTOM:
                J = !1;
                break;
            case f.keys.LEFT:
                K = !1;
                break;
            case f.keys.RIGHT:
                L = !1
            }
        }
        function n(a) {
            if (!1 !== f.enabled && !0 !== f.noKeys && !0 !== f.noRotate) {
                switch (a.keyCode) {
                case f.keys.UP:
                    G = !0;
                    break;
                case f.keys.BOTTOM:
                    J = !0;
                    break;
                case f.keys.LEFT:
                    K = !0;
                    break;
                case f.keys.RIGHT:
                    L = !0
                }
                if (G || J || K || L)
                    U = !0,
                    G && (P = -f.rotateSpeed * f.momentumKeydownFactor),
                    J && (P = f.rotateSpeed * f.momentumKeydownFactor),
                    K && (O = -f.rotateSpeed * f.momentumKeydownFactor),
                    L && (O = f.rotateSpeed * f.momentumKeydownFactor)
            }
        }
        function l(a) {
            U = !1;
            O = P = 0;
            if (!1 !== f.enabled) {
                switch (a.touches.length) {
                case 1:
                    if (!0 === f.noRotate)
                        return;
                    w = v.TOUCH_ROTATE;
                    D.set(a.touches[0].pageX, a.touches[0].pageY);
                    break;
                case 2:
                    if (!0 === f.noZoom)
                        return;
                    w = v.TOUCH_DOLLY;
                    var b = a.touches[0].pageX - a.touches[1].pageX;
                    a = a.touches[0].pageY - a.touches[1].pageY;
                    u.set(0, Math.sqrt(b * b + a * a));
                    break;
                case 3:
                    if (!0 === f.noPan)
                        return;
                    w = v.TOUCH_PAN;
                    r.set(a.touches[0].pageX, a.touches[0].pageY);
                    break;
                default:
                    w = v.NONE
                }
                w !== v.NONE && f.dispatchEvent(R)
            }
        }
        function x(a) {
            if (!1 !== f.enabled) {
                a.preventDefault();
                a.stopPropagation();
                var b = f.domElement === document ? f.domElement.body : f.domElement;
                switch (a.touches.length) {
                case 1:
                    if (!0 === f.noRotate)
                        break;
                    if (w !== v.TOUCH_ROTATE)
                        break;
                    k.set(a.touches[0].pageX, a.touches[0].pageY);
                    m.subVectors(k, D);
                    f.rotateLeft(2 * Math.PI * m.x / b.clientWidth * f.rotateSpeed);
                    f.rotateUp(2 * Math.PI * m.y / b.clientHeight * f.rotateSpeed);
                    D.copy(k);
                    H && (O = a.touches[0].pageX - H.pageX,
                    P = a.touches[0].pageY - H.pageY);
                    H = {
                        pageX: a.touches[0].pageX,
                        pageY: a.touches[0].pageY
                    };
                    f.update();
                    break;
                case 2:
                    if (!0 === f.noZoom)
                        break;
                    if (w !== v.TOUCH_DOLLY)
                        break;
                    b = a.touches[0].pageX - a.touches[1].pageX;
                    a = a.touches[0].pageY - a.touches[1].pageY;
                    y.set(0, Math.sqrt(b * b + a * a));
                    z.subVectors(y, u);
                    0 > z.y ? (f.object.fov = f.object.fov < f.maxFov ? f.object.fov + 1 : f.maxFov,
                    f.object.updateProjectionMatrix()) : 0 < z.y && (f.object.fov = f.object.fov > f.minFov ? f.object.fov - 1 : f.minFov,
                    f.object.updateProjectionMatrix());
                    u.copy(y);
                    f.update();
                    f.dispatchEvent(X);
                    break;
                case 3:
                    if (!0 === f.noPan)
                        break;
                    if (w !== v.TOUCH_PAN)
                        break;
                    W.set(a.touches[0].pageX, a.touches[0].pageY);
                    q.subVectors(W, r);
                    f.pan(q.x, q.y);
                    r.copy(W);
                    f.update();
                    break;
                default:
                    w = v.NONE
                }
            }
        }
        function Q() {
            U = !0;
            H = void 0;
            !1 !== f.enabled && (f.dispatchEvent(S),
            w = v.NONE)
        }
        this.object = a;
        this.domElement = void 0 !== b ? b : document;
        this.frameId = null;
        this.enabled = !0;
        this.center = this.target = new d.Vector3;
        this.noZoom = !1;
        this.zoomSpeed = 1;
        this.minDistance = 0;
        this.maxDistance = Infinity;
        this.minZoom = 0;
        this.maxZoom = Infinity;
        this.noRotate = !1;
        this.rotateSpeed = -.15;
        this.noPan = !0;
        this.keyPanSpeed = 7;
        this.autoRotate = !1;
        this.autoRotateSpeed = 2;
        this.minPolarAngle = 0;
        this.maxPolarAngle = Math.PI;
        this.momentumDampingFactor = .9;
        this.momentumScalingFactor = -.005;
        this.momentumKeydownFactor = 20;
        this.minFov = 30;
        this.maxFov = 120;
        this.minAzimuthAngle = -Infinity;
        this.maxAzimuthAngle = Infinity;
        this.noKeys = !1;
        this.keys = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            BOTTOM: 40
        };
        this.mouseButtons = {
            ORBIT: d.MOUSE.LEFT,
            ZOOM: d.MOUSE.MIDDLE,
            PAN: d.MOUSE.RIGHT
        };
        var f = this, D = new d.Vector2, k = new d.Vector2, m = new d.Vector2, r = new d.Vector2, W = new d.Vector2, q = new d.Vector2, t = new d.Vector3, A = new d.Vector3, u = new d.Vector2, y = new d.Vector2, z = new d.Vector2, V = 0, I = 0, B = 0, C = 0, E = 1, F = new d.Vector3, M = new d.Vector3, N = new d.Quaternion, O = 0, P = 0, H, U = !1, G, J, K, L, v = {
            NONE: -1,
            ROTATE: 0,
            DOLLY: 1,
            PAN: 2,
            TOUCH_ROTATE: 3,
            TOUCH_DOLLY: 4,
            TOUCH_PAN: 5
        }, w = v.NONE;
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.zoom0 = this.object.zoom;
        var T = (new d.Quaternion).setFromUnitVectors(a.up, new d.Vector3(0,1,0))
          , Y = T.clone().inverse()
          , X = {
            type: "change"
        }
          , R = {
            type: "start"
        }
          , S = {
            type: "end"
        };
        this.setLastQuaternion = function(a) {
            N.copy(a);
            f.object.quaternion.copy(a)
        }
        ;
        this.getLastPosition = function() {
            return M
        }
        ;
        this.rotateLeft = function(a) {
            void 0 === a && (a = 2 * Math.PI / 60 / 60 * f.autoRotateSpeed);
            C -= a
        }
        ;
        this.rotateUp = function(a) {
            void 0 === a && (a = 2 * Math.PI / 60 / 60 * f.autoRotateSpeed);
            B -= a
        }
        ;
        this.panLeft = function(a) {
            var b = this.object.matrix.elements;
            t.set(b[0], b[1], b[2]);
            t.multiplyScalar(-a);
            F.add(t)
        }
        ;
        this.panUp = function(a) {
            var b = this.object.matrix.elements;
            t.set(b[4], b[5], b[6]);
            t.multiplyScalar(a);
            F.add(t)
        }
        ;
        this.pan = function(a, b) {
            var e = f.domElement === document ? f.domElement.body : f.domElement;
            if (f.object instanceof d.PerspectiveCamera) {
                var c = f.object.position.clone().sub(f.target).length();
                c *= Math.tan(f.object.fov / 2 * Math.PI / 180);
                f.panLeft(2 * a * c / e.clientHeight);
                f.panUp(2 * b * c / e.clientHeight)
            } else
                f.object instanceof d.OrthographicCamera ? (f.panLeft(a * (f.object.right - f.object.left) / e.clientWidth),
                f.panUp(b * (f.object.top - f.object.bottom) / e.clientHeight)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.")
        }
        ;
        this.momentum = function() {
            U && (1E-4 > Math.abs(O) && 1E-4 > Math.abs(P) ? U = !1 : (P *= this.momentumDampingFactor,
            O *= this.momentumDampingFactor,
            C -= this.momentumScalingFactor * O,
            B -= this.momentumScalingFactor * P))
        }
        ;
        this.dollyIn = function(a) {
            void 0 === a && (a = Math.pow(.95, f.zoomSpeed));
            f.object instanceof d.PerspectiveCamera ? E /= a : f.object instanceof d.OrthographicCamera ? (f.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom * a)),
            f.object.updateProjectionMatrix(),
            f.dispatchEvent(X)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")
        }
        ;
        this.dollyOut = function(a) {
            void 0 === a && (a = Math.pow(.95, f.zoomSpeed));
            f.object instanceof d.PerspectiveCamera ? E *= a : f.object instanceof d.OrthographicCamera ? (f.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / a)),
            f.object.updateProjectionMatrix(),
            f.dispatchEvent(X)) : console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.")
        }
        ;
        this.update = function(a) {
            var b = this.object.position;
            A.copy(b).sub(this.target);
            A.applyQuaternion(T);
            V = Math.atan2(A.x, A.z);
            I = Math.atan2(Math.sqrt(A.x * A.x + A.z * A.z), A.y);
            this.autoRotate && w === v.NONE && this.rotateLeft(2 * Math.PI / 60 / 60 * f.autoRotateSpeed);
            this.momentum();
            V += C;
            I += B;
            V = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, V));
            I = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, I));
            I = Math.max(1E-7, Math.min(Math.PI - 1E-7, I));
            var e = A.length() * E;
            e = Math.max(this.minDistance, Math.min(this.maxDistance, e));
            this.target.add(F);
            A.x = e * Math.sin(I) * Math.sin(V);
            A.y = e * Math.cos(I);
            A.z = e * Math.sin(I) * Math.cos(V);
            A.applyQuaternion(Y);
            b.copy(this.target).add(A);
            this.object.lookAt(this.target);
            B = C = 0;
            E = 1;
            F.set(0, 0, 0);
            if (1E-7 < M.distanceToSquared(this.object.position) || 1E-7 < 8 * (1 - N.dot(this.object.quaternion)))
                !0 !== a && this.dispatchEvent(X),
                M.copy(this.object.position),
                N.copy(this.object.quaternion)
        }
        ;
        this.reset = function() {
            w = v.NONE;
            this.target.copy(this.target0);
            this.object.position.copy(this.position0);
            this.object.zoom = this.zoom0;
            this.object.updateProjectionMatrix();
            this.dispatchEvent(X);
            this.update()
        }
        ;
        this.getPolarAngle = function() {
            return I
        }
        ;
        this.getAzimuthalAngle = function() {
            return V
        }
        ;
        this.dispose = function() {
            this.domElement.removeEventListener("mousedown", c);
            this.domElement.removeEventListener("mousewheel", h);
            this.domElement.removeEventListener("DOMMouseScroll", h);
            this.domElement.removeEventListener("touchstart", l);
            this.domElement.removeEventListener("touchend", Q);
            this.domElement.removeEventListener("touchmove", x);
            window.removeEventListener("keyup", p);
            window.removeEventListener("keydown", n)
        }
        ;
        this.domElement.addEventListener("mousedown", c, {
            passive: !1
        });
        this.domElement.addEventListener("mousewheel", h, {
            passive: !1
        });
        this.domElement.addEventListener("DOMMouseScroll", h, {
            passive: !1
        });
        this.domElement.addEventListener("touchstart", l, {
            passive: !1
        });
        this.domElement.addEventListener("touchend", Q, {
            passive: !1
        });
        this.domElement.addEventListener("touchmove", x, {
            passive: !1
        });
        window.addEventListener("keyup", p, {
            passive: !1
        });
        window.addEventListener("keydown", n, {
            passive: !1
        });
        this.update()
    }
    function da(a, b) {
        var c = this
          , e = {
            type: "change"
        }
          , g = 0
          , h = 0
          , p = 0;
        this.camera = a;
        this.camera.rotation.reorder("YXZ");
        this.domElement = void 0 !== b ? b : document;
        this.enabled = !0;
        this.deviceOrientation = null;
        this.alphaOffsetAngle = this.alpha = this.screenOrientation = 0;
        var n = function(a) {
            c.deviceOrientation = a
        }
          , l = function() {
            c.screenOrientation = window.orientation || 0
        }
          , x = function(a) {
            a.preventDefault();
            a.stopPropagation();
            h = a.touches[0].pageX;
            p = a.touches[0].pageY
        }
          , Q = function(a) {
            a.preventDefault();
            a.stopPropagation();
            g += d.Math.degToRad((p - a.touches[0].pageY) / 4);
            c.rotateLeft(-d.Math.degToRad((a.touches[0].pageX - h) / 4));
            h = a.touches[0].pageX;
            p = a.touches[0].pageY
        };
        this.connect = function() {
            l();
            window.addEventListener("orientationchange", l, {
                passive: !0
            });
            window.addEventListener("deviceorientation", n, {
                passive: !0
            });
            window.addEventListener("deviceorientation", this.update.bind(this), {
                passive: !0
            });
            c.domElement.addEventListener("touchstart", x, {
                passive: !1
            });
            c.domElement.addEventListener("touchmove", Q, {
                passive: !1
            });
            c.enabled = !0
        }
        ;
        this.disconnect = function() {
            window.removeEventListener("orientationchange", l, !1);
            window.removeEventListener("deviceorientation", n, !1);
            window.removeEventListener("deviceorientation", this.update.bind(this), !1);
            c.domElement.removeEventListener("touchstart", x, !1);
            c.domElement.removeEventListener("touchmove", Q, !1);
            c.enabled = !1
        }
        ;
        this.update = function(a) {
            if (!1 !== c.enabled && c.deviceOrientation) {
                var b = c.deviceOrientation.alpha ? d.Math.degToRad(c.deviceOrientation.alpha) + c.alphaOffsetAngle : 0
                  , h = c.deviceOrientation.beta ? d.Math.degToRad(c.deviceOrientation.beta) : 0
                  , f = c.deviceOrientation.gamma ? d.Math.degToRad(c.deviceOrientation.gamma) : 0
                  , p = c.screenOrientation ? d.Math.degToRad(c.screenOrientation) : 0
                  , n = c.camera.quaternion
                  , l = new d.Vector3(0,0,1)
                  , x = new d.Euler
                  , Q = new d.Quaternion
                  , k = new d.Quaternion(-Math.sqrt(.5),0,0,Math.sqrt(.5))
                  , m = new d.Quaternion
                  , r = new d.Quaternion;
                if (0 == c.screenOrientation) {
                    var q = new d.Vector3(1,0,0);
                    m.setFromAxisAngle(q, -g)
                } else
                    180 == c.screenOrientation ? (q = new d.Vector3(1,0,0),
                    m.setFromAxisAngle(q, g)) : 90 == c.screenOrientation ? (q = new d.Vector3(0,1,0),
                    m.setFromAxisAngle(q, g)) : -90 == c.screenOrientation && (q = new d.Vector3(0,1,0),
                    m.setFromAxisAngle(q, -g));
                k.multiply(m);
                k.multiply(r);
                x.set(h, b, -f, "YXZ");
                n.setFromEuler(x);
                n.multiply(k);
                n.multiply(Q.setFromAxisAngle(l, -p));
                c.alpha = b;
                !0 !== a && c.dispatchEvent(e)
            }
        }
        ;
        this.updateAlphaOffsetAngle = function(a) {
            this.alphaOffsetAngle = a
        }
        ;
        this.updateRotX = function(a) {
            g = a
        }
        ;
        this.rotateLeft = function(a) {
            this.updateAlphaOffsetAngle(this.alphaOffsetAngle - a)
        }
        ;
        this.rotateUp = function(a) {
            this.updateRotX(g + a)
        }
        ;
        this.dispose = function() {
            this.disconnect()
        }
        ;
        this.connect()
    }
    function ia(a) {
        var b = new d.OrthographicCamera(-1,1,1,-1,0,1)
          , c = new d.Scene
          , e = new d.StereoCamera;
        e.aspect = .5;
        var g = new d.WebGLRenderTarget(512,512,{
            minFilter: d.LinearFilter,
            magFilter: d.NearestFilter,
            format: d.RGBAFormat
        });
        g.scissorTest = !0;
        g.texture.generateMipmaps = !1;
        var h = new d.Vector2(.441,.156)
          , p = (new d.PlaneBufferGeometry(1,1,10,20)).removeAttribute("normal").toNonIndexed()
          , n = p.attributes.position.array
          , l = p.attributes.uv.array;
        p.attributes.position.count *= 2;
        p.attributes.uv.count *= 2;
        var x = new Float32Array(2 * n.length);
        x.set(n);
        x.set(n, n.length);
        var k = new Float32Array(2 * l.length);
        k.set(l);
        k.set(l, l.length);
        l = new d.Vector2;
        n = n.length / 3;
        for (var f = 0, D = x.length / 3; f < D; f++) {
            l.x = x[3 * f];
            l.y = x[3 * f + 1];
            var m = l.dot(l);
            m = 1.5 + (h.x + h.y * m) * m;
            var q = f < n ? 0 : 1;
            x[3 * f] = l.x / m * 1.5 - .5 + q;
            x[3 * f + 1] = l.y / m * 3;
            k[2 * f] = .5 * (k[2 * f] + q)
        }
        p.attributes.position.array = x;
        p.attributes.uv.array = k;
        h = new d.MeshBasicMaterial({
            map: g.texture
        });
        p = new d.Mesh(p,h);
        c.add(p);
        this.setEyeSeparation = function(a) {
            e.eyeSep = a
        }
        ;
        this.setSize = function(b, e) {
            a.setSize(b, e);
            var c = a.getPixelRatio();
            g.setSize(b * c, e * c)
        }
        ;
        this.render = function(h, f, d) {
            var p = d instanceof N || d instanceof G;
            h.updateMatrixWorld();
            p && this.setEyeSeparation(d.stereo.eyeSep);
            null === f.parent && f.updateMatrixWorld();
            e.update(f);
            f = g.width / 2;
            var n = g.height;
            a.autoClear && a.clear();
            p && d.updateTextureToLeft();
            g.scissor.set(0, 0, f, n);
            g.viewport.set(0, 0, f, n);
            a.setRenderTarget(g);
            a.render(h, e.cameraL);
            a.clearDepth();
            p && d.updateTextureToRight();
            g.scissor.set(f, 0, f, n);
            g.viewport.set(f, 0, f, n);
            a.setRenderTarget(g);
            a.render(h, e.cameraR);
            a.clearDepth();
            a.setRenderTarget(null);
            a.render(c, b)
        }
    }
    function ea(a) {
        a = void 0 === a ? {} : a;
        var b = this.options = Object.assign({
            container: this.setupContainer(a.container),
            controlBar: !0,
            controlButtons: ["fullscreen", "setting", "video"],
            autoHideControlBar: !1,
            autoHideInfospot: !0,
            horizontalView: !1,
            clickTolerance: 10,
            cameraFov: 60,
            reverseDragging: !1,
            enableReticle: !1,
            dwellTime: 1500,
            autoReticleSelect: !0,
            viewIndicator: !1,
            indicatorSize: 30,
            output: null,
            autoRotate: !1,
            autoRotateSpeed: 2,
            autoRotateActivationDuration: 5E3,
            initialLookAt: new d.Vector3(0,0,-Number.MAX_SAFE_INTEGER)
        }, a);
        a = b.container;
        var c = b.cameraFov
          , e = b.controlBar
          , g = b.controlButtons
          , h = b.viewIndicator
          , p = b.indicatorSize
          , n = b.enableReticle
          , l = b.reverseDragging
          , k = b.output
          , Q = b.scene
          , f = b.camera;
        b = b.renderer;
        var D = a.clientWidth
          , r = a.clientHeight;
        this.container = a;
        this.scene = this.setupScene(Q);
        this.sceneReticle = new d.Scene;
        this.camera = this.setupCamera(c, D / r, f);
        this.renderer = this.setupRenderer(b, a);
        this.reticle = this.addReticle(this.camera, this.sceneReticle);
        this.control = this.setupControls(this.camera, a);
        this.effect = this.setupEffects(this.renderer, a);
        this.mode = q.NORMAL;
        this.pressObject = this.pressEntityObject = this.infospot = this.hoverObject = this.widget = this.panorama = null;
        this.raycaster = new d.Raycaster;
        this.raycasterPoint = new d.Vector2;
        this.userMouse = new d.Vector2;
        this.updateCallbacks = [];
        this.requestAnimationId = null;
        this.cameraFrustum = new d.Frustum;
        this.cameraViewProjectionMatrix = new d.Matrix4;
        this.outputDivElement = this.autoRotateRequestId = null;
        this.touchSupported = "ontouchstart"in window || window.DocumentTouch && document instanceof DocumentTouch;
        this.tweenLeftAnimation = new m.Tween;
        this.tweenUpAnimation = new m.Tween;
        this.outputEnabled = !1;
        this.viewIndicatorSize = p;
        this.tempEnableReticle = n;
        this.handlerMouseUp = this.onMouseUp.bind(this);
        this.handlerMouseDown = this.onMouseDown.bind(this);
        this.handlerMouseMove = this.onMouseMove.bind(this);
        this.handlerWindowResize = this.onWindowResize.bind(this);
        this.handlerKeyDown = this.onKeyDown.bind(this);
        this.handlerKeyUp = this.onKeyUp.bind(this);
        this.handlerTap = this.onTap.bind(this, {
            clientX: D / 2,
            clientY: r / 2
        });
        e && this.addDefaultControlBar(g);
        h && this.addViewIndicator();
        l && this.reverseDraggingDirection();
        n ? this.enableReticleControl() : this.registerMouseAndTouchEvents();
        "overlay" === k && this.addOutputElement();
        this.registerEventListeners();
        this.animate.call(this)
    }
    var ja = "^0.105.2".replace(/[^0-9.]/g, "")
      , E = {
        ORBIT: 0,
        DEVICEORIENTATION: 1
    }
      , q = {
        UNKNOWN: 0,
        NORMAL: 1,
        CARDBOARD: 2,
        STEREO: 3
    }
      , C = {
        TAB: 0,
        SBS: 1
    }
      , t = {
        Info: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAADBklEQVR42u2bP08UQRiHnzFaSYCI/xoksdBIqGwIiYWRUBISExpCQ0ej38FWOmlIKKhoMPEbaCxsrrHiYrQgOSlQEaICrT+LHSPZzNzt3s3c3Hn7lHvLzvv82L2dm30XKioqKgYY062BJF0HpoA7wARwBbhsPz4DjoEG8AnYNcZ8Sx1Op8IXJM1KWpdUV3nq9m9nJV1I7VNGfEzSM0mNNqR9NOwxx1L7NRMflbQm6SSgeJ4TO8Zoat+8/LKkg4jieQ4kLaf2RtKwpJ0uiufZkTScSn5S0l5C+b/sSZrstvyMpKPU5uc4kjTTjkvpeYCkaeA1/+7hvcIZMGuMqUULQNIU8Aa4ltrWwyHwyBizGzwASSPAe+B2assW7AH3jTE/i+xcZoa12Qfy2Bo3i+5cKABl99zF1GYlWFTBeULLS0DZrOsDcDNggTXgc27bLWA64BhfgHvGmB8dHUXZ1DM0S45xliKMs9bKr+klIOkqsBrwv9JtVq1DewEAT4Ch1BYdMGQdygeg7Df4SmqDAKyoyXpCszPgITCeuvoAjFuX0gE8jljUdv7bCtiOOJ7XpdUZ8L/gdXHOA5QtYH5NXXVgbrgWWn1nwFTqaiPgdPIFcDd1tRFwOl307DwRuZgXwLvctgfA04hjOp18AcReZ6sZY16e3yDpUuQxnU6+S2AkcjEpcDr1zxOXSPgCKLSa0mc4nXwB/EpdbQScTr4AGqmrjYDTyRfAx9TVRsDp5Aug8LJyH+F0cgZg58z11BUHpO5ruGh2G3ybuuqAeF2aBfAqddUB8bq0OgP2U1cegH3aOQOMMb+BrdTVB2DLupQLwLIOnKY26IBT6+ClaQDGmO/ARmqLDtiwDn7HVkcY+EdjNoTlCI+tYhO2iUppm6HKslPUq2qQKHpUe8AFsjaUXuUQWCgqXyoAG8IuME/WkNRrnAHzZfqDSgdgQ6gBc2Td3b3CMTBXtkOsIzTIjZLnQhjcVtlcEIPZLJ0LoVvt8s/Va+3yuSAG84UJRxB98cpM9dJURUVFxSDzBxKde4Lk3/h2AAAAAElFTkSuQmCC",
        Arrow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAADPklEQVR42u2bMUscQRiG30/SRaJEI1ZKUiRErNIELRUbQYSAnX8hpVUgkDYp0wgWVjYW+QcJaQzYpLojJIXhtDDEKBpj65ti58ixmdmb2ZvZ7+T2AUHudmfmeXf2bnb3O6CmpqZmgJGqOiI5AWAWwEMA0wDuArht3r4CcAagBeAbgIaI/NQOp1fhIZKLJN+SbDKcptl3keSQtk+I+BjJVyRbJaRdtEybY9p+ReKjJN+QvIwonufS9DGq7ZuXXyd5nFA8zzHJdW1vkLxDcrdC8Ty7JO9oyc+QPFCUb3NAcqZq+TmSp9rmHZySnCvjErwOIPkUwHv8+w7vF64ALIrIfrIASM4C+ADgnratgxMACyLSiB4AyREAnwE80LbswgGAJyJy4bNxyApr6wbIw4xxy3djrwCYfeeuaZsFsEbPdULXU4DZqusLgMkEA21P05EEbf8A8FhEzos28pkBLxLKL5s/r/M1kEkz9vKQHGeatf05yfmOfubNa7G5JDle5NhtBjwHMBz5yFwAWBaRT+0XzP8pZsKwcQiH2fX8Ycojb+kzxUw4ZJn7CSQXqpRPHMKCq7+iZJ71Mvdy/DftXSQ6HcJdSDaqPPKW/mPOBO+lcbvzCU35RCFM2PpwnQKzZQfdgfe0dxH5dLA6uQJ4pC2fIASrkyuA6X6QjxyC1ckVQNn7bNHlI4ZgdXIFUObiJJl8pBCsTjGfuIwA2Cv4FN7xbYjkjqsRAHuIePXoCiDF1Zk2VidXAL+1R5sAq5MrgJb2aBNgdXIF8FV7tAmwOrkCCFs73wysTtYATHFCU3vEEWm6Ci6KvgY/ao86Ik6XogDeaY86Ik6XbjPgSHvkEThCwQy45XpDRK5JbgN4GWkgUyR9H65MRQxgW0SunZ5FezK7pfwd8e8MV8UfAPdF5Jdrg8JrAbPjprZFD2wWyQP6j8ZSEufRmGlgQ9umBBvd5IOgbjFUKLu+XnWBhG+rpsFVZGUo/coJgFVf+aAATAgNACvICpL6jSsAKyH1QcEBmBD2ASwhq+7uF84ALIVWiPUEB7lQsiOEwS2VzQUxmMXSuRCqKpd/zX4rl88FMZg/mLAEcSN+MlP/aKqmpqZmkPkL0hSjwOpNKxwAAAAASUVORK5CYII=",
        FullscreenEnter: "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik03IDE0SDV2NWg1di0ySDd2LTN6bS0yLTRoMlY3aDNWNUg1djV6bTEyIDdoLTN2Mmg1di01aC0ydjN6TTE0IDV2MmgzdjNoMlY1aC01eiIvPgo8L3N2Zz4=",
        FullscreenLeave: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggc3R5bGU9ImZpbGw6I2ZmZiIgZD0iTTE0LDE0SDE5VjE2SDE2VjE5SDE0VjE0TTUsMTRIMTBWMTlIOFYxNkg1VjE0TTgsNUgxMFYxMEg1VjhIOFY1TTE5LDhWMTBIMTRWNUgxNlY4SDE5WiIgLz48L3N2Zz4=",
        VideoPlay: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggc3R5bGU9ImZpbGw6I2ZmZiIgZD0iTTgsNS4xNFYxOS4xNEwxOSwxMi4xNEw4LDUuMTRaIiAvPjwvc3ZnPg==",
        VideoPause: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggc3R5bGU9ImZpbGw6I2ZmZiIgZD0iTTE0LDE5LjE0SDE4VjUuMTRIMTRNNiwxOS4xNEgxMFY1LjE0SDZWMTkuMTRaIiAvPjwvc3ZnPg==",
        WhiteTile: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIABAMAAAAGVsnJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB1WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KAtiABQAAACRQTFRFAAAAAAAABgYGBwcHHh4eKysrx8fHy8vLzMzM7OzsAAAABgYG+q7SZgAAAAp0Uk5TAP7+/v7+/v7+/iJx/a8AAAOwSURBVHja7d0hbsNAEAVQo6SFI6XEcALDcgNLvUBvEBQVhpkWVYWlhSsVFS7t5QIshRt695lEASZP+8c7a1kzDL1fz+/zyuvzp6FbvoddrL6uDd1yGZ5eXldeb18N3fIx7A+58prmhm65DfvDcd0952lu6JabFbD/zVprZj1lzcys+fj9z8xTZtbT8rv8yWlu6BYAIgAAAAAAAAAAAABAM6QXEAEAAAAAAAAAgJ2gnaAIiIA3Q2qAGgAAAAAAAAAAAAAAAAAAAAAAAAAAQJsADkVFAAAAAAA8Bj0GRUAEREAEREAEREAEREAEAAAAAAAAAAB2gnaCIiACPplRA9QANUAERAAAAEVQERQBERCBVlfAcZ3aeZobusUKMGBhV6KUElHGKBERJR6/fxExRkQZl9/lT8S1oVsuhqyYMmPKjCkzvfcCpsxohrwY0Q06EAEAAAAAAAAAAACgGdILiAAAAAAAAAAAwE7QTlAERMCbITVADQAAAAAAAAAAAAAAAAAAAAAAAAAAwKmwQ1ERAAAAAACPQY9BERABERABERABERABERABAAAAAAAAAICdoJ2gCIiAT2bUADVADRABEQAAQBFUBEVABERgEyvAlJm+V4ApM6bMmDJjyowpM6bMdN0LmDKjGfJiRDfoQAQAAAAAAAAAAACAZkgvIAIAAAAAAAAAADtBO0EREAFvhtQANQAAAAAAAAAAAAAAAAAAAAAAAAAAAKfCDkVFAAAAAAA8Bj0GRUAEREAEREAEREAEREAEAAAAAAAAAAB2gnaCIiACPplRA9QANUAERAAAAEVQERQBERCBTawAU2b6XgGmzJgyY8qMKTOmzJgy03UvYMqMZsiLEd2gAxEAAAAAAAAAAAAAmiG9gAgAAAAAAAAAAOwE7QRFQAS8GVID1AAAAAAAAAAAAAAAAAAAAAAAAAAAAJwKOxQVAQAAAADwGPQYFAEREAEREAEREAEREAERAAAAAAAAAADYCdoJioAI+GRGDVAD1AAREAEAABRBRVAEREAENrECTJnpewWYMmPKjCkzpsyYMmPKTNe9gCkzmiEvRnSDDkQAAAAAAAAAAAAAaIb0AiIAAAAAAAAAALATtBMUARHwZkgNUAMAAAAAAAAAAAAAAAAAAAAAAAAAAHAq7FBUBAAAAADAY9BjUAREQAREQAREQAREQAREAAAAAAAAAABgJ2gnKAIi4JMZNUANUANEQAQAAFAEFUEREAER2MQKMGWm7xVgyowpM50PWen9ugNGXz1XaocAFgAAAABJRU5ErkJggg==",
        Setting: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAADn0lEQVR42u2bzUsVURjGnyO6CPzAMnTjppAo3LTwH1CqTfaxbeOiRS37A0wXtROFVi1aRBs3LWohSIGbQAQXViBGRhG0UIRKUCpK7q/FnOB2uc6cOXNmRnGe3eW+H8/7zLln3vNxpQoVKlQ4wjBFJAFOSRqX1O7osivpvjHmU1nChBZglvSYLYJbS0EanCvIJzWK+gnsyH34/8OuMaYjb265jwCgz6N4SWq3vodbAEmnS/KtBDgoAgyU5BteAOAkMAPcBroc7PskDWfgN+wyDwBdltMMcDI3tYBnde/pHeARMNTErgd4APzweP834oeN1dMkz5DlsFNn/yyv4kdiSK4At4AO4CqwGaDwRmza2B0210qM7YhrXU59ANAq6bWkwQTTn5KO5fIE0uVYlXTeGLOXFMx1DrjlULwKKN41x6DlnIjEEQCckPRe0okCiguJr5LOGGO+xhm5jICJQ1i8LOeJJKPYEQAMKvrtt5ZdjSf2FM0Fq/sZJI2A6UNcvCz36TiDfUcAcE1SPu/U6Mm8k/TFfu6XdFb5iX3dGPM8lQfwNod3+TowBnQ3yddtv1vPIe+b1JIBiwEJ1IAJ208k5W21trWA+V/5CHAcmAtU/A2P/DcCiTAHHE8tgCVhgLvAXgYCk17Jo/yTGfLuWe7Zd72AC8CWB4n3OAz7mLytNkZabAEXMhfeQKYfWEpJZCxA3rGUOZeA/qDF15FpAz47EvlNk9neI2e3jeWCz0BbmvipNkSMMX8kuSZYM8Z8zyqAjbHmaN5mOeYjgIXrU93MWrxHrNQjrqiDkQMLHwG+OdqF3NN3jeXKzU8AoF1SzdH8XKhJUO7HZDXLMbwAwICkJUULFxe0SbqSVQAbw3Xi7Ze0ZLmGAzAKbHs0JGU1QtvAaIjCW4B7ZOvJy2qFa5a730RPtBiaz0CgnkiZi6F5fBZDVMvho7EhcuS3xJJ2hV9IupgTqaLw0hhzab8vq23xOG/r+LDsKjLgYVzxUnU0ltwK2wDezUyJmEwqXgp/PL4rvxthaeCSI+zxuA10J8ZkWdJNSb2SLkvayKHwDRu71+ZajrG941J8agALDQ3GU/a/IvMkYCPzmCbtLNEVmacNtgs5iP9fYVNEV1Q6Hez7yNZSL+J2SarTcpqiyV2iUkG0IvPFvbz5FbEn+KEk3wMjwMeSfCsBXFBdly9CAPk9ydyffpECuB5tZfVJjaKWueOSfinln6YK4lahQoUKRxd/AcRPGTcQCAUQAAAAAElFTkSuQmCC",
        ChevronRight: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTguNTksMTYuNThMMTMuMTcsMTJMOC41OSw3LjQxTDEwLDZMMTYsMTJMMTAsMThMOC41OSwxNi41OFoiIC8+PC9zdmc+",
        Check: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIxLDdMOSwxOUwzLjUsMTMuNUw0LjkxLDEyLjA5TDksMTYuMTdMMTkuNTksNS41OUwyMSw3WiIgLz48L3N2Zz4=",
        ViewIndicator: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBpZD0idmlldy1pbmRpY2F0b3IiIGhlaWdodD0iMzAiIHdpZHRoPSIzMCIgdmlld0JveD0iLTIuNSAtMSAzMCAzMCI+Cgk8c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5zdDB7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7ZmlsbDpub25lO30uc3Qxe3N0cm9rZS13aWR0aDo2O3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCTwvc3R5bGU+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNIDEyLjUgMCBBIDEyLjUgMTIuNSAwIDAgMCAtMTIuNSAwIEEgMTIuNSAxMi41IDAgMCAwIDEyLjUgMCIgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwxMywxNS41KSI+PC9wYXRoPgoJCTxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0gMTMgMCBMIDEwIDIgTCAxNiAyIFoiPjwvcGF0aD4KCQk8cGF0aCBjbGFzcz0ic3QyIiBkPSJNIDIgMCBBIDIgMiAwIDAgMCAtMiAwIEEgMiAyIDAgMCAwIDIgMCIgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwxMywxNS41KSI+PC9wYXRoPgoJCTxwYXRoIGNsYXNzPSJzdDEiIGlkPSJpbmRpY2F0b3IiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsMTMsMTUuNSkiPjwvcGF0aD4KCTwvZz4KPC9zdmc+"
    }
      , fa = {
        load: function(a, b, c, e) {
            b = void 0 === b ? function() {}
            : b;
            c = void 0 === c ? function() {}
            : c;
            e = void 0 === e ? function() {}
            : e;
            d.Cache.enabled = !0;
            var g, h, p, n;
            for (n in t)
                t.hasOwnProperty(n) && a === t[n] && (g = n);
            var l = d.Cache.get(g ? g : a);
            if (void 0 !== l)
                return b && setTimeout(function() {
                    c({
                        loaded: 1,
                        total: 1
                    });
                    b(l)
                }, 0),
                l;
            var k = window.URL || window.webkitURL;
            var m = document.createElementNS("http://www.w3.org/1999/xhtml", "img");
            d.Cache.add(g ? g : a, m);
            var f = function() {
                k.revokeObjectURL(m.src);
                b(m)
            };
            if (0 === a.indexOf("data:"))
                return m.addEventListener("load", f, !1),
                m.src = a,
                m;
            m.crossOrigin = void 0 !== this.crossOrigin ? this.crossOrigin : "";
            g = new window.XMLHttpRequest;
            g.open("GET", a, !0);
            g.responseType = "arraybuffer";
            g.addEventListener("error", e);
            g.addEventListener("progress", function(a) {
                if (a) {
                    var b = a.loaded
                      , e = a.total;
                    a.lengthComputable && c({
                        loaded: b,
                        total: e
                    })
                }
            });
            g.addEventListener("loadend", function(a) {
                a && (h = new Uint8Array(a.currentTarget.response),
                p = new window.Blob([h]),
                m.addEventListener("load", f, !1),
                m.src = k.createObjectURL(p))
            });
            g.send(null)
        }
    }
      , K = {
        load: function(a, b, c, e) {
            b = void 0 === b ? function() {}
            : b;
            var g = new d.Texture;
            fa.load(a, function(e) {
                g.image = e;
                e = 0 < a.search(/\.(jpg|jpeg)$/) || 0 === a.search(/^data:image\/jpeg/);
                g.format = e ? d.RGBFormat : d.RGBAFormat;
                g.needsUpdate = !0;
                b(g)
            }, c, e);
            return g
        }
    }
      , ha = {
        load: function(a, b, c, e) {
            b = void 0 === b ? function() {}
            : b;
            c = void 0 === c ? function() {}
            : c;
            var g;
            var h = new d.CubeTexture([]);
            var p = 0;
            var n = {};
            var l = {};
            a.map(function(a, d) {
                fa.load(a, function(a) {
                    h.images[d] = a;
                    p++;
                    6 === p && (h.needsUpdate = !0,
                    b(h))
                }, function(a) {
                    n[d] = {
                        loaded: a.loaded,
                        total: a.total
                    };
                    l.loaded = 0;
                    g = l.total = 0;
                    for (var b in n)
                        g++,
                        l.loaded += n[b].loaded,
                        l.total += n[b].total;
                    6 > g && (l.total = l.total / g * 6);
                    c(l)
                }, e)
            });
            return h
        }
    };
    Y.prototype = Object.assign(Object.create(d.EventDispatcher.prototype), {
        setContainer: function(a) {
            this.container = a
        },
        setScene: function(a) {
            this.scene = a
        },
        enumerateDevices: function() {
            var a = this.devices
              , b = new Promise(function(b) {
                b(a)
            }
            );
            return 0 < a.length ? b : window.navigator.mediaDevices.enumerateDevices()
        },
        switchNextVideoDevice: function() {
            var a = this.stop.bind(this)
              , b = this.start.bind(this)
              , c = this.setVideDeviceIndex.bind(this)
              , e = this.videoDeviceIndex;
            this.getDevices("video").then(function(g) {
                a();
                e++;
                e >= g.length ? (c(0),
                e--) : c(e);
                b(g[e])
            })
        },
        getDevices: function(a) {
            a = void 0 === a ? "video" : a;
            var b = this.devices;
            return this.enumerateDevices().then(function(a) {
                return a.map(function(a) {
                    b.includes(a) || b.push(a);
                    return a
                })
            }).then(function(b) {
                var e = new RegExp(a,"i");
                return b.filter(function(a) {
                    return e.test(a.kind)
                })
            })
        },
        getUserMedia: function(a) {
            var b = this.setMediaStream.bind(this)
              , c = this.playVideo.bind(this);
            return window.navigator.mediaDevices.getUserMedia(a).then(b).then(c).catch(function(a) {
                console.warn("PANOLENS.Media: " + a)
            })
        },
        setVideDeviceIndex: function(a) {
            this.videoDeviceIndex = a
        },
        start: function(a) {
            var b = this.constraints
              , c = this.getUserMedia.bind(this);
            this.element = this.createVideoElement();
            return this.getDevices().then(function(e) {
                if (!e || 0 === e.length)
                    throw Error("no video device found");
                b.video.deviceId = (a || e[0]).deviceId;
                return c(b)
            })
        },
        stop: function() {
            var a = this.stream;
            a && a.active && (a.getTracks()[0].stop(),
            window.removeEventListener("resize", this.onWindowResize.bind(this)),
            this.stream = this.element = null)
        },
        setMediaStream: function(a) {
            this.stream = a;
            this.element.srcObject = a;
            this.scene && (this.scene.background = this.createVideoTexture());
            window.addEventListener("resize", this.onWindowResize.bind(this))
        },
        playVideo: function() {
            var a = this.element;
            a && (a.play(),
            this.dispatchEvent({
                type: "play"
            }))
        },
        pauseVideo: function() {
            var a = this.element;
            a && (a.pause(),
            this.dispatchEvent({
                type: "pause"
            }))
        },
        createVideoTexture: function() {
            var a = this.element
              , b = new d.VideoTexture(a);
            b.generateMipmaps = !1;
            b.minFilter = d.LinearFilter;
            b.magFilter = d.LinearFilter;
            b.format = d.RGBFormat;
            b.center.set(.5, .5);
            a.addEventListener("canplay", this.onWindowResize.bind(this));
            return b
        },
        createVideoElement: function() {
            var a = this.dispatchEvent.bind(this)
              , b = document.createElement("video");
            b.setAttribute("autoplay", "");
            b.setAttribute("muted", "");
            b.setAttribute("playsinline", "");
            b.style.position = "absolute";
            b.style.top = "0";
            b.style.left = "0";
            b.style.width = "100%";
            b.style.height = "100%";
            b.style.objectPosition = "center";
            b.style.objectFit = "cover";
            b.style.display = this.scene ? "none" : "";
            b.addEventListener("canplay", function() {
                return a({
                    type: "canplay"
                })
            });
            return b
        },
        onWindowResize: function() {
            if (this.element && this.element.videoWidth && this.element.videoHeight && this.scene) {
                var a = this.container
                  , b = a.clientWidth;
                a = a.clientHeight;
                var c = this.scene.background
                  , e = this.element;
                e = e.videoHeight / e.videoWidth * (this.container ? b / a : 1) * this.ratioScalar;
                b > a ? c.repeat.set(e, 1) : c.repeat.set(1, 1 / e)
            }
        }
    });
    Object.assign(F.prototype, {
        constructor: F,
        updateUniformByFormat: function(a, b) {
            this.format = a;
            var c = b.repeat.value;
            b = b.offset.value;
            var e = this.loffset
              , g = this.roffset;
            switch (a) {
            case C.TAB:
                c.set(1, .5);
                b.set(0, .5);
                e.set(0, .5);
                g.set(0, 0);
                break;
            case C.SBS:
                c.set(.5, 1),
                b.set(0, 0),
                e.set(0, 0),
                g.set(.5, 0)
            }
        },
        updateTextureToLeft: function(a) {
            a.copy(this.loffset)
        },
        updateTextureToRight: function(a) {
            a.copy(this.roffset)
        }
    });
    J.prototype = Object.assign(Object.create(d.Sprite.prototype), {
        constructor: J,
        setColor: function(a) {
            this.material.color.copy(a instanceof d.Color ? a : new d.Color(a))
        },
        createCanvasTexture: function(a) {
            a = new d.CanvasTexture(a);
            a.minFilter = d.LinearFilter;
            a.magFilter = d.LinearFilter;
            a.generateMipmaps = !1;
            return a
        },
        createCanvas: function() {
            var a = document.createElement("canvas")
              , b = a.getContext("2d")
              , c = this.dpr;
            a.width = 32 * c;
            a.height = 32 * c;
            b.scale(c, c);
            b.shadowBlur = 5;
            b.shadowColor = "rgba(200,200,200,0.9)";
            return {
                canvas: a,
                context: b
            }
        },
        updateCanvasArcByProgress: function(a) {
            var b = this.context
              , c = this.canvasWidth
              , e = this.canvasHeight
              , g = this.material
              , h = this.dpr
              , d = a * Math.PI * 2
              , n = this.color.getStyle()
              , l = .5 * c / h;
            h = .5 * e / h;
            b.clearRect(0, 0, c, e);
            b.beginPath();
            0 === a ? (b.arc(l, h, c / 16, 0, 2 * Math.PI),
            b.fillStyle = n,
            b.fill()) : (b.arc(l, h, c / 4 - 3, -Math.PI / 2, -Math.PI / 2 + d),
            b.strokeStyle = n,
            b.lineWidth = 3,
            b.stroke());
            b.closePath();
            g.map.needsUpdate = !0
        },
        ripple: function() {
            var a = this
              , b = this.context
              , c = this.canvasWidth
              , e = this.canvasHeight
              , g = this.material
              , h = this.rippleDuration
              , d = performance.now()
              , n = this.color
              , l = this.dpr
              , k = .5 * c / l
              , m = .5 * e / l
              , f = function() {
                var p = window.requestAnimationFrame(f)
                  , x = (performance.now() - d) / h
                  , q = 0 < 1 - x ? 1 - x : 0
                  , r = x * c * .5 / l;
                b.clearRect(0, 0, c, e);
                b.beginPath();
                b.arc(k, m, r, 0, 2 * Math.PI);
                b.fillStyle = "rgba(" + 255 * n.r + ", " + 255 * n.g + ", " + 255 * n.b + ", " + q + ")";
                b.fill();
                b.closePath();
                1 <= x && (window.cancelAnimationFrame(p),
                a.updateCanvasArcByProgress(0),
                a.dispatchEvent({
                    type: "reticle-ripple-end"
                }));
                g.map.needsUpdate = !0
            };
            this.dispatchEvent({
                type: "reticle-ripple-start"
            });
            f()
        },
        show: function() {
            this.visible = !0
        },
        hide: function() {
            this.visible = !1
        },
        start: function(a) {
            this.autoSelect && (this.dispatchEvent({
                type: "reticle-start"
            }),
            this.startTimestamp = performance.now(),
            this.callback = a,
            this.update())
        },
        end: function() {
            this.startTimestamp && (window.cancelAnimationFrame(this.timerId),
            this.updateCanvasArcByProgress(0),
            this.startTimestamp = this.timerId = this.callback = null,
            this.dispatchEvent({
                type: "reticle-end"
            }))
        },
        update: function() {
            this.timerId = window.requestAnimationFrame(this.update.bind(this));
            var a = (performance.now() - this.startTimestamp) / this.dwellTime;
            this.updateCanvasArcByProgress(a);
            this.dispatchEvent({
                type: "reticle-update",
                progress: a
            });
            1 <= a && (window.cancelAnimationFrame(this.timerId),
            this.callback && this.callback(),
            this.end(),
            this.ripple())
        }
    });
    var m = function(a, b) {
        return b = {
            exports: {}
        },
        a(b, b.exports),
        b.exports
    }(function(a, b) {
        b = function() {
            this._tweens = {};
            this._tweensAddedDuringUpdate = {}
        }
        ;
        b.prototype = {
            getAll: function() {
                return Object.keys(this._tweens).map(function(a) {
                    return this._tweens[a]
                }
                .bind(this))
            },
            removeAll: function() {
                this._tweens = {}
            },
            add: function(a) {
                this._tweens[a.getId()] = a;
                this._tweensAddedDuringUpdate[a.getId()] = a
            },
            remove: function(a) {
                delete this._tweens[a.getId()];
                delete this._tweensAddedDuringUpdate[a.getId()]
            },
            update: function(a, b) {
                var e = Object.keys(this._tweens);
                if (0 === e.length)
                    return !1;
                for (a = void 0 !== a ? a : c.now(); 0 < e.length; ) {
                    this._tweensAddedDuringUpdate = {};
                    for (var g = 0; g < e.length; g++) {
                        var d = this._tweens[e[g]];
                        d && !1 === d.update(a) && (d._isPlaying = !1,
                        b || delete this._tweens[e[g]])
                    }
                    e = Object.keys(this._tweensAddedDuringUpdate)
                }
                return !0
            }
        };
        var c = new b;
        c.Group = b;
        c._nextId = 0;
        c.nextId = function() {
            return c._nextId++
        }
        ;
        c.now = "undefined" === typeof self && "undefined" !== typeof process && process.hrtime ? function() {
            var a = process.hrtime();
            return 1E3 * a[0] + a[1] / 1E6
        }
        : "undefined" !== typeof self && void 0 !== self.performance && void 0 !== self.performance.now ? self.performance.now.bind(self.performance) : void 0 !== Date.now ? Date.now : function() {
            return (new Date).getTime()
        }
        ;
        c.Tween = function(a, b) {
            this._object = a;
            this._valuesStart = {};
            this._valuesEnd = {};
            this._valuesStartRepeat = {};
            this._duration = 1E3;
            this._repeat = 0;
            this._repeatDelayTime = void 0;
            this._reversed = this._isPlaying = this._yoyo = !1;
            this._delayTime = 0;
            this._startTime = null;
            this._easingFunction = c.Easing.Linear.None;
            this._interpolationFunction = c.Interpolation.Linear;
            this._chainedTweens = [];
            this._onStartCallback = null;
            this._onStartCallbackFired = !1;
            this._onStopCallback = this._onCompleteCallback = this._onRepeatCallback = this._onUpdateCallback = null;
            this._group = b || c;
            this._id = c.nextId()
        }
        ;
        c.Tween.prototype = {
            getId: function() {
                return this._id
            },
            isPlaying: function() {
                return this._isPlaying
            },
            to: function(a, b) {
                this._valuesEnd = Object.create(a);
                void 0 !== b && (this._duration = b);
                return this
            },
            duration: function(a) {
                this._duration = a;
                return this
            },
            start: function(a) {
                this._group.add(this);
                this._isPlaying = !0;
                this._onStartCallbackFired = !1;
                this._startTime = void 0 !== a ? "string" === typeof a ? c.now() + parseFloat(a) : a : c.now();
                this._startTime += this._delayTime;
                for (var b in this._valuesEnd) {
                    if (this._valuesEnd[b]instanceof Array) {
                        if (0 === this._valuesEnd[b].length)
                            continue;
                        this._valuesEnd[b] = [this._object[b]].concat(this._valuesEnd[b])
                    }
                    void 0 !== this._object[b] && (this._valuesStart[b] = this._object[b],
                    !1 === this._valuesStart[b]instanceof Array && (this._valuesStart[b] *= 1),
                    this._valuesStartRepeat[b] = this._valuesStart[b] || 0)
                }
                return this
            },
            stop: function() {
                if (!this._isPlaying)
                    return this;
                this._group.remove(this);
                this._isPlaying = !1;
                null !== this._onStopCallback && this._onStopCallback(this._object);
                this.stopChainedTweens();
                return this
            },
            end: function() {
                this.update(Infinity);
                return this
            },
            stopChainedTweens: function() {
                for (var a = 0, b = this._chainedTweens.length; a < b; a++)
                    this._chainedTweens[a].stop()
            },
            group: function(a) {
                this._group = a;
                return this
            },
            delay: function(a) {
                this._delayTime = a;
                return this
            },
            repeat: function(a) {
                this._repeat = a;
                return this
            },
            repeatDelay: function(a) {
                this._repeatDelayTime = a;
                return this
            },
            yoyo: function(a) {
                this._yoyo = a;
                return this
            },
            easing: function(a) {
                this._easingFunction = a;
                return this
            },
            interpolation: function(a) {
                this._interpolationFunction = a;
                return this
            },
            chain: function() {
                this._chainedTweens = arguments;
                return this
            },
            onStart: function(a) {
                this._onStartCallback = a;
                return this
            },
            onUpdate: function(a) {
                this._onUpdateCallback = a;
                return this
            },
            onRepeat: function(a) {
                this._onRepeatCallback = a;
                return this
            },
            onComplete: function(a) {
                this._onCompleteCallback = a;
                return this
            },
            onStop: function(a) {
                this._onStopCallback = a;
                return this
            },
            update: function(a) {
                var b;
                if (a < this._startTime)
                    return !0;
                !1 === this._onStartCallbackFired && (null !== this._onStartCallback && this._onStartCallback(this._object),
                this._onStartCallbackFired = !0);
                var e = (a - this._startTime) / this._duration;
                e = 0 === this._duration || 1 < e ? 1 : e;
                var c = this._easingFunction(e);
                for (b in this._valuesEnd)
                    if (void 0 !== this._valuesStart[b]) {
                        var d = this._valuesStart[b] || 0
                          , l = this._valuesEnd[b];
                        l instanceof Array ? this._object[b] = this._interpolationFunction(l, c) : ("string" === typeof l && (l = "+" === l.charAt(0) || "-" === l.charAt(0) ? d + parseFloat(l) : parseFloat(l)),
                        "number" === typeof l && (this._object[b] = d + (l - d) * c))
                    }
                null !== this._onUpdateCallback && this._onUpdateCallback(this._object, e);
                if (1 === e)
                    if (0 < this._repeat) {
                        isFinite(this._repeat) && this._repeat--;
                        for (b in this._valuesStartRepeat)
                            "string" === typeof this._valuesEnd[b] && (this._valuesStartRepeat[b] += parseFloat(this._valuesEnd[b])),
                            this._yoyo && (e = this._valuesStartRepeat[b],
                            this._valuesStartRepeat[b] = this._valuesEnd[b],
                            this._valuesEnd[b] = e),
                            this._valuesStart[b] = this._valuesStartRepeat[b];
                        this._yoyo && (this._reversed = !this._reversed);
                        this._startTime = void 0 !== this._repeatDelayTime ? a + this._repeatDelayTime : a + this._delayTime;
                        null !== this._onRepeatCallback && this._onRepeatCallback(this._object)
                    } else {
                        null !== this._onCompleteCallback && this._onCompleteCallback(this._object);
                        a = 0;
                        for (b = this._chainedTweens.length; a < b; a++)
                            this._chainedTweens[a].start(this._startTime + this._duration);
                        return !1
                    }
                return !0
            }
        };
        c.Easing = {
            Linear: {
                None: function(a) {
                    return a
                }
            },
            Quadratic: {
                In: function(a) {
                    return a * a
                },
                Out: function(a) {
                    return a * (2 - a)
                },
                InOut: function(a) {
                    return 1 > (a *= 2) ? .5 * a * a : -.5 * (--a * (a - 2) - 1)
                }
            },
            Cubic: {
                In: function(a) {
                    return a * a * a
                },
                Out: function(a) {
                    return --a * a * a + 1
                },
                InOut: function(a) {
                    return 1 > (a *= 2) ? .5 * a * a * a : .5 * ((a -= 2) * a * a + 2)
                }
            },
            Quartic: {
                In: function(a) {
                    return a * a * a * a
                },
                Out: function(a) {
                    return 1 - --a * a * a * a
                },
                InOut: function(a) {
                    return 1 > (a *= 2) ? .5 * a * a * a * a : -.5 * ((a -= 2) * a * a * a - 2)
                }
            },
            Quintic: {
                In: function(a) {
                    return a * a * a * a * a
                },
                Out: function(a) {
                    return --a * a * a * a * a + 1
                },
                InOut: function(a) {
                    return 1 > (a *= 2) ? .5 * a * a * a * a * a : .5 * ((a -= 2) * a * a * a * a + 2)
                }
            },
            Sinusoidal: {
                In: function(a) {
                    return 1 - Math.cos(a * Math.PI / 2)
                },
                Out: function(a) {
                    return Math.sin(a * Math.PI / 2)
                },
                InOut: function(a) {
                    return .5 * (1 - Math.cos(Math.PI * a))
                }
            },
            Exponential: {
                In: function(a) {
                    return 0 === a ? 0 : Math.pow(1024, a - 1)
                },
                Out: function(a) {
                    return 1 === a ? 1 : 1 - Math.pow(2, -10 * a)
                },
                InOut: function(a) {
                    return 0 === a ? 0 : 1 === a ? 1 : 1 > (a *= 2) ? .5 * Math.pow(1024, a - 1) : .5 * (-Math.pow(2, -10 * (a - 1)) + 2)
                }
            },
            Circular: {
                In: function(a) {
                    return 1 - Math.sqrt(1 - a * a)
                },
                Out: function(a) {
                    return Math.sqrt(1 - --a * a)
                },
                InOut: function(a) {
                    return 1 > (a *= 2) ? -.5 * (Math.sqrt(1 - a * a) - 1) : .5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
                }
            },
            Elastic: {
                In: function(a) {
                    return 0 === a ? 0 : 1 === a ? 1 : -Math.pow(2, 10 * (a - 1)) * Math.sin(5 * (a - 1.1) * Math.PI)
                },
                Out: function(a) {
                    return 0 === a ? 0 : 1 === a ? 1 : Math.pow(2, -10 * a) * Math.sin(5 * (a - .1) * Math.PI) + 1
                },
                InOut: function(a) {
                    if (0 === a)
                        return 0;
                    if (1 === a)
                        return 1;
                    a *= 2;
                    return 1 > a ? -.5 * Math.pow(2, 10 * (a - 1)) * Math.sin(5 * (a - 1.1) * Math.PI) : .5 * Math.pow(2, -10 * (a - 1)) * Math.sin(5 * (a - 1.1) * Math.PI) + 1
                }
            },
            Back: {
                In: function(a) {
                    return a * a * (2.70158 * a - 1.70158)
                },
                Out: function(a) {
                    return --a * a * (2.70158 * a + 1.70158) + 1
                },
                InOut: function(a) {
                    return 1 > (a *= 2) ? .5 * a * a * (3.5949095 * a - 2.5949095) : .5 * ((a -= 2) * a * (3.5949095 * a + 2.5949095) + 2)
                }
            },
            Bounce: {
                In: function(a) {
                    return 1 - c.Easing.Bounce.Out(1 - a)
                },
                Out: function(a) {
                    return a < 1 / 2.75 ? 7.5625 * a * a : a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + .75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + .9375 : 7.5625 * (a -= 2.625 / 2.75) * a + .984375
                },
                InOut: function(a) {
                    return .5 > a ? .5 * c.Easing.Bounce.In(2 * a) : .5 * c.Easing.Bounce.Out(2 * a - 1) + .5
                }
            }
        };
        c.Interpolation = {
            Linear: function(a, b) {
                var e = a.length - 1
                  , g = e * b
                  , d = Math.floor(g)
                  , l = c.Interpolation.Utils.Linear;
                return 0 > b ? l(a[0], a[1], g) : 1 < b ? l(a[e], a[e - 1], e - g) : l(a[d], a[d + 1 > e ? e : d + 1], g - d)
            },
            Bezier: function(a, b) {
                for (var e = 0, g = a.length - 1, d = Math.pow, l = c.Interpolation.Utils.Bernstein, k = 0; k <= g; k++)
                    e += d(1 - b, g - k) * d(b, k) * a[k] * l(g, k);
                return e
            },
            CatmullRom: function(a, b) {
                var e = a.length - 1
                  , g = e * b
                  , d = Math.floor(g)
                  , l = c.Interpolation.Utils.CatmullRom;
                return a[0] === a[e] ? (0 > b && (d = Math.floor(g = e * (1 + b))),
                l(a[(d - 1 + e) % e], a[d], a[(d + 1) % e], a[(d + 2) % e], g - d)) : 0 > b ? a[0] - (l(a[0], a[0], a[1], a[1], -g) - a[0]) : 1 < b ? a[e] - (l(a[e], a[e], a[e - 1], a[e - 1], g - e) - a[e]) : l(a[d ? d - 1 : 0], a[d], a[e < d + 1 ? e : d + 1], a[e < d + 2 ? e : d + 2], g - d)
            },
            Utils: {
                Linear: function(a, b, c) {
                    return (b - a) * c + a
                },
                Bernstein: function(a, b) {
                    var e = c.Interpolation.Utils.Factorial;
                    return e(a) / e(b) / e(a - b)
                },
                Factorial: function() {
                    var a = [1];
                    return function(b) {
                        var c = 1;
                        if (a[b])
                            return a[b];
                        for (var e = b; 1 < e; e--)
                            c *= e;
                        return a[b] = c
                    }
                }(),
                CatmullRom: function(a, b, c, d, n) {
                    a = .5 * (c - a);
                    d = .5 * (d - b);
                    var e = n * n;
                    return (2 * b - 2 * c + a + d) * n * e + (-3 * b + 3 * c - 2 * a - d) * e + a * n + b
                }
            }
        };
        a.exports = c
    });
    y.prototype = Object.assign(Object.create(d.Sprite.prototype), {
        constructor: y,
        setContainer: function(a) {
            if (a instanceof HTMLElement)
                var b = a;
            else
                a && a.container && (b = a.container);
            b && this.element && b.appendChild(this.element);
            this.container = b
        },
        getContainer: function() {
            return this.container
        },
        onClick: function(a) {
            this.element && this.getContainer() && (this.onHoverStart(a),
            this.lockHoverElement())
        },
        onDismiss: function() {
            this.element && (this.unlockHoverElement(),
            this.onHoverEnd())
        },
        onHover: function() {},
        onHoverStart: function(a) {
            if (this.getContainer()) {
                var b = this.cursorStyle || (this.mode === q.NORMAL ? "pointer" : "default")
                  , c = this.scaleDownAnimation
                  , e = this.scaleUpAnimation
                  , g = this.element;
                this.isHovering = !0;
                this.container.style.cursor = b;
                this.animated && (c.stop(),
                e.start());
                g && 0 <= a.mouseEvent.clientX && 0 <= a.mouseEvent.clientY && (a = g.left,
                b = g.right,
                c = g.style,
                this.mode === q.CARDBOARD || this.mode === q.STEREO ? (c.display = "none",
                a.style.display = "block",
                b.style.display = "block",
                g._width = a.clientWidth,
                g._height = a.clientHeight) : (c.display = "block",
                a && (a.style.display = "none"),
                b && (b.style.display = "none"),
                g._width = g.clientWidth,
                g._height = g.clientHeight))
            }
        },
        onHoverEnd: function() {
            if (this.getContainer()) {
                var a = this.scaleDownAnimation
                  , b = this.scaleUpAnimation
                  , c = this.element;
                this.isHovering = !1;
                this.container.style.cursor = "default";
                this.animated && (b.stop(),
                a.start());
                c && !this.element.locked && (a = c.left,
                b = c.right,
                c.style.display = "none",
                a && (a.style.display = "none"),
                b && (b.style.display = "none"),
                this.unlockHoverElement())
            }
        },
        onDualEyeEffect: function(a) {
            if (this.getContainer()) {
                this.mode = a.mode;
                a = this.element;
                var b = this.container.clientWidth / 2;
                var c = this.container.clientHeight / 2;
                a && (a.left || a.right || (a.left = a.cloneNode(!0),
                a.right = a.cloneNode(!0)),
                this.mode === q.CARDBOARD || this.mode === q.STEREO ? (a.left.style.display = a.style.display,
                a.right.style.display = a.style.display,
                a.style.display = "none") : (a.style.display = a.left.style.display,
                a.left.style.display = "none",
                a.right.style.display = "none"),
                this.translateElement(b, c),
                this.container.appendChild(a.left),
                this.container.appendChild(a.right))
            }
        },
        translateElement: function(a, b) {
            if (this.element._width && this.element._height && this.getContainer()) {
                var c = this.container;
                var e = this.element;
                var g = e._width / 2;
                var d = e._height / 2;
                var p = void 0 !== e.verticalDelta ? e.verticalDelta : 40;
                var n = a - g;
                var l = b - d - p;
                this.mode !== q.CARDBOARD && this.mode !== q.STEREO || !e.left || !e.right || a === c.clientWidth / 2 && b === c.clientHeight / 2 ? this.setElementStyle("transform", e, "translate(" + n + "px, " + l + "px)") : (n = c.clientWidth / 4 - g + (a - c.clientWidth / 2),
                l = c.clientHeight / 2 - d - p + (b - c.clientHeight / 2),
                this.setElementStyle("transform", e.left, "translate(" + n + "px, " + l + "px)"),
                n += c.clientWidth / 2,
                this.setElementStyle("transform", e.right, "translate(" + n + "px, " + l + "px)"))
            }
        },
        setElementStyle: function(a, b, c) {
            b = b.style;
            "transform" === a && (b.webkitTransform = b.msTransform = b.transform = c)
        },
        setText: function(a) {
            this.element && (this.element.textContent = a)
        },
        setCursorHoverStyle: function(a) {
            this.cursorStyle = a
        },
        addHoverText: function(a, b) {
            b = void 0 === b ? 40 : b;
            this.element || (this.element = document.createElement("div"),
            this.element.style.display = "none",
            this.element.style.color = "#fff",
            this.element.style.top = 0,
            this.element.style.maxWidth = "50%",
            this.element.style.maxHeight = "50%",
            this.element.style.textShadow = "0 0 3px #000000",
            this.element.style.fontFamily = '"Trebuchet MS", Helvetica, sans-serif',
            this.element.style.position = "absolute",
            this.element.classList.add("panolens-infospot"),
            this.element.verticalDelta = b);
            this.setText(a)
        },
        addHoverElement: function(a, b) {
            b = void 0 === b ? 40 : b;
            this.element || (this.element = a.cloneNode(!0),
            this.element.style.display = "none",
            this.element.style.top = 0,
            this.element.style.position = "absolute",
            this.element.classList.add("panolens-infospot"),
            this.element.verticalDelta = b)
        },
        removeHoverElement: function() {
            this.element && (this.element.left && (this.container.removeChild(this.element.left),
            this.element.left = null),
            this.element.right && (this.container.removeChild(this.element.right),
            this.element.right = null),
            this.container.removeChild(this.element),
            this.element = null)
        },
        lockHoverElement: function() {
            this.element && (this.element.locked = !0)
        },
        unlockHoverElement: function() {
            this.element && (this.element.locked = !1)
        },
        enableRaycast: function(a) {
            this.raycast = void 0 === a || a ? this.originalRaycast : function() {}
        },
        show: function(a) {
            a = void 0 === a ? 0 : a;
            var b = this.hideAnimation
              , c = this.showAnimation
              , e = this.material;
            this.animated ? (b.stop(),
            c.delay(a).start()) : (this.enableRaycast(!0),
            e.opacity = 1)
        },
        hide: function(a) {
            a = void 0 === a ? 0 : a;
            var b = this.hideAnimation
              , c = this.showAnimation
              , e = this.material;
            this.animated ? (c.stop(),
            b.delay(a).start()) : (this.enableRaycast(!1),
            e.opacity = 0)
        },
        setFocusMethod: function(a) {
            a && (this.HANDLER_FOCUS = a.method)
        },
        focus: function(a, b) {
            this.HANDLER_FOCUS && (this.HANDLER_FOCUS(this.position, a, b),
            this.onDismiss())
        },
        dispose: function() {
            var a = this.geometry
              , b = this.material
              , c = b.map;
            this.removeHoverElement();
            this.parent && this.parent.remove(this);
            c && (c.dispose(),
            b.map = null);
            a && (a.dispose(),
            this.geometry = null);
            b && (b.dispose(),
            this.material = null)
        }
    });
    L.prototype = Object.assign(Object.create(d.EventDispatcher.prototype), {
        constructor: L,
        addControlBar: function() {
            if (this.container) {
                var a = this
                  , b = document.createElement("div");
                b.style.width = "100%";
                b.style.height = "44px";
                b.style.float = "left";
                b.style.transform = b.style.webkitTransform = b.style.msTransform = "translateY(-100%)";
                b.style.background = "-webkit-linear-gradient(bottom, rgba(0,0,0,0.2), rgba(0,0,0,0))";
                b.style.background = "-moz-linear-gradient(bottom, rgba(0,0,0,0.2), rgba(0,0,0,0))";
                b.style.background = "-o-linear-gradient(bottom, rgba(0,0,0,0.2), rgba(0,0,0,0))";
                b.style.background = "-ms-linear-gradient(bottom, rgba(0,0,0,0.2), rgba(0,0,0,0))";
                b.style.background = "linear-gradient(bottom, rgba(0,0,0,0.2), rgba(0,0,0,0))";
                b.style.transition = this.DEFAULT_TRANSITION;
                b.style.pointerEvents = "none";
                b.isHidden = !1;
                b.toggle = function() {
                    b.isHidden = !b.isHidden;
                    var a = b.isHidden ? 0 : 1;
                    b.style.transform = b.style.webkitTransform = b.style.msTransform = b.isHidden ? "translateY(0)" : "translateY(-100%)";
                    b.style.opacity = a
                }
                ;
                var c = this.createDefaultMenu();
                this.mainMenu = this.createMainMenu(c);
                b.appendChild(this.mainMenu);
                this.mask = c = this.createMask();
                this.container.appendChild(c);
                b.dispose = function() {
                    a.fullscreenElement && (b.removeChild(a.fullscreenElement),
                    a.fullscreenElement.dispose(),
                    a.fullscreenElement = null);
                    a.settingElement && (b.removeChild(a.settingElement),
                    a.settingElement.dispose(),
                    a.settingElement = null);
                    a.videoElement && (b.removeChild(a.videoElement),
                    a.videoElement.dispose(),
                    a.videoElement = null)
                }
                ;
                this.container.appendChild(b);
                this.mask.addEventListener("mousemove", this.PREVENT_EVENT_HANDLER, !0);
                this.mask.addEventListener("mouseup", this.PREVENT_EVENT_HANDLER, !0);
                this.mask.addEventListener("mousedown", this.PREVENT_EVENT_HANDLER, !0);
                this.mask.addEventListener(a.TOUCH_ENABLED ? "touchend" : "click", function(b) {
                    b.preventDefault();
                    b.stopPropagation();
                    a.mask.hide();
                    a.settingElement.deactivate()
                }, !1);
                this.addEventListener("control-bar-toggle", b.toggle);
                this.barElement = b
            } else
                console.warn("Widget container not set")
        },
        createDefaultMenu: function() {
            var a = this
              , b = function(b, e) {
                return function() {
                    a.dispatchEvent({
                        type: "panolens-viewer-handler",
                        method: b,
                        data: e
                    })
                }
            };
            return [{
                title: "Control",
                subMenu: [{
                    title: this.TOUCH_ENABLED ? "Touch" : "Mouse",
                    handler: b("enableControl", E.ORBIT)
                }, {
                    title: "Sensor",
                    handler: b("enableControl", E.DEVICEORIENTATION)
                }]
            }, {
                title: "Mode",
                subMenu: [{
                    title: "Normal",
                    handler: b("disableEffect")
                }, {
                    title: "Cardboard",
                    handler: b("enableEffect", q.CARDBOARD)
                }, {
                    title: "Stereoscopic",
                    handler: b("enableEffect", q.STEREO)
                }]
            }]
        },
        addControlButton: function(a) {
            switch (a) {
            case "fullscreen":
                this.fullscreenElement = a = this.createFullscreenButton();
                break;
            case "setting":
                this.settingElement = a = this.createSettingButton();
                break;
            case "video":
                this.videoElement = a = this.createVideoControl();
                break;
            default:
                return
            }
            a && this.barElement.appendChild(a)
        },
        createMask: function() {
            var a = document.createElement("div");
            a.style.position = "absolute";
            a.style.top = 0;
            a.style.left = 0;
            a.style.width = "100%";
            a.style.height = "100%";
            a.style.background = "transparent";
            a.style.display = "none";
            a.show = function() {
                this.style.display = "block"
            }
            ;
            a.hide = function() {
                this.style.display = "none"
            }
            ;
            return a
        },
        createSettingButton: function() {
            var a = this;
            var b = this.createCustomItem({
                style: {
                    backgroundImage: 'url("' + t.Setting + '")',
                    webkitTransition: this.DEFAULT_TRANSITION,
                    transition: this.DEFAULT_TRANSITION
                },
                onTap: function(b) {
                    b.preventDefault();
                    b.stopPropagation();
                    a.mainMenu.toggle();
                    this.activated ? this.deactivate() : this.activate()
                }
            });
            b.activate = function() {
                this.style.transform = "rotate3d(0,0,1,90deg)";
                this.activated = !0;
                a.mask.show()
            }
            ;
            b.deactivate = function() {
                this.style.transform = "rotate3d(0,0,0,0)";
                this.activated = !1;
                a.mask.hide();
                a.mainMenu && a.mainMenu.visible && a.mainMenu.hide();
                a.activeSubMenu && a.activeSubMenu.visible && a.activeSubMenu.hide();
                a.mainMenu && a.mainMenu._width && (a.mainMenu.changeSize(a.mainMenu._width),
                a.mainMenu.unslideAll())
            }
            ;
            b.activated = !1;
            return b
        },
        createFullscreenButton: function() {
            function a() {
                e && (c = !c,
                d.style.backgroundImage = c ? 'url("' + t.FullscreenLeave + '")' : 'url("' + t.FullscreenEnter + '")');
                b.dispatchEvent({
                    type: "panolens-viewer-handler",
                    method: "onWindowResize"
                });
                e = !0
            }
            var b = this
              , c = !1
              , e = !0
              , g = this.container;
            if (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) {
                document.addEventListener("fullscreenchange", a, !1);
                document.addEventListener("webkitfullscreenchange", a, !1);
                document.addEventListener("mozfullscreenchange", a, !1);
                document.addEventListener("MSFullscreenChange", a, !1);
                var d = this.createCustomItem({
                    style: {
                        backgroundImage: 'url("' + t.FullscreenEnter + '")'
                    },
                    onTap: function(a) {
                        a.preventDefault();
                        a.stopPropagation();
                        e = !1;
                        c ? (document.exitFullscreen && document.exitFullscreen(),
                        document.msExitFullscreen && document.msExitFullscreen(),
                        document.mozCancelFullScreen && document.mozCancelFullScreen(),
                        document.webkitExitFullscreen && document.webkitExitFullscreen(),
                        c = !1) : (g.requestFullscreen && g.requestFullscreen(),
                        g.msRequestFullscreen && g.msRequestFullscreen(),
                        g.mozRequestFullScreen && g.mozRequestFullScreen(),
                        g.webkitRequestFullscreen && g.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT),
                        c = !0);
                        this.style.backgroundImage = c ? 'url("' + t.FullscreenLeave + '")' : 'url("' + t.FullscreenEnter + '")'
                    }
                });
                if (!document.querySelector("panolens-style-addon")) {
                    var p = document.createElement("style");
                    p.id = "panolens-style-addon";
                    p.innerHTML = ":-webkit-full-screen { width: 100% !important; height: 100% !important }";
                    document.body.appendChild(p)
                }
                return d
            }
        },
        createVideoControl: function() {
            var a = document.createElement("span");
            a.style.display = "none";
            a.show = function() {
                a.style.display = ""
            }
            ;
            a.hide = function() {
                a.style.display = "none";
                a.controlButton.paused = !0;
                a.controlButton.update()
            }
            ;
            a.controlButton = this.createVideoControlButton();
            a.seekBar = this.createVideoControlSeekbar();
            a.appendChild(a.controlButton);
            a.appendChild(a.seekBar);
            a.dispose = function() {
                a.removeChild(a.controlButton);
                a.removeChild(a.seekBar);
                a.controlButton.dispose();
                a.controlButton = null;
                a.seekBar.dispose();
                a.seekBar = null
            }
            ;
            this.addEventListener("video-control-show", a.show);
            this.addEventListener("video-control-hide", a.hide);
            return a
        },
        createVideoControlButton: function() {
            var a = this
              , b = this.createCustomItem({
                style: {
                    float: "left",
                    backgroundImage: 'url("' + t.VideoPlay + '")'
                },
                onTap: function(c) {
                    c.preventDefault();
                    c.stopPropagation();
                    a.dispatchEvent({
                        type: "panolens-viewer-handler",
                        method: "toggleVideoPlay",
                        data: !this.paused
                    });
                    this.paused = !this.paused;
                    b.update()
                }
            });
            b.paused = !0;
            b.update = function(a) {
                this.paused = void 0 !== a ? a : this.paused;
                this.style.backgroundImage = 'url("' + (this.paused ? t.VideoPlay : t.VideoPause) + '")'
            }
            ;
            return b
        },
        createVideoControlSeekbar: function() {
            function a(a) {
                a.stopPropagation();
                d = !0;
                p = a.clientX || a.changedTouches && a.changedTouches[0].clientX;
                n = parseInt(k.style.width) / 100;
                g.container.addEventListener("mousemove", b, {
                    passive: !0
                });
                g.container.addEventListener("mouseup", c, {
                    passive: !0
                });
                g.container.addEventListener("touchmove", b, {
                    passive: !0
                });
                g.container.addEventListener("touchend", c, {
                    passive: !0
                })
            }
            function b(a) {
                d && (l = ((a.clientX || a.changedTouches && a.changedTouches[0].clientX) - p) / f.clientWidth,
                l = n + l,
                l = 1 < l ? 1 : 0 > l ? 0 : l,
                f.setProgress(l),
                g.dispatchEvent({
                    type: "panolens-viewer-handler",
                    method: "setVideoCurrentTime",
                    data: l
                }))
            }
            function c(a) {
                a.stopPropagation();
                d = !1;
                e()
            }
            function e() {
                g.container.removeEventListener("mousemove", b, !1);
                g.container.removeEventListener("mouseup", c, !1);
                g.container.removeEventListener("touchmove", b, !1);
                g.container.removeEventListener("touchend", c, !1)
            }
            var g = this, d = !1, p, n, l;
            var k = document.createElement("div");
            k.style.width = "0%";
            k.style.height = "100%";
            k.style.backgroundColor = "#fff";
            var m = document.createElement("div");
            m.style.float = "right";
            m.style.width = "14px";
            m.style.height = "14px";
            m.style.transform = "translate(7px, -5px)";
            m.style.borderRadius = "50%";
            m.style.backgroundColor = "#ddd";
            m.addEventListener("mousedown", a, {
                passive: !0
            });
            m.addEventListener("touchstart", a, {
                passive: !0
            });
            k.appendChild(m);
            var f = this.createCustomItem({
                style: {
                    float: "left",
                    width: "30%",
                    height: "4px",
                    marginTop: "20px",
                    backgroundColor: "rgba(188,188,188,0.8)"
                },
                onTap: function(a) {
                    a.preventDefault();
                    a.stopPropagation();
                    if (a.target !== m) {
                        var b = a.changedTouches && 0 < a.changedTouches.length ? (a.changedTouches[0].pageX - a.target.getBoundingClientRect().left) / this.clientWidth : a.offsetX / this.clientWidth;
                        g.dispatchEvent({
                            type: "panolens-viewer-handler",
                            method: "setVideoCurrentTime",
                            data: b
                        });
                        f.setProgress(a.offsetX / this.clientWidth)
                    }
                },
                onDispose: function() {
                    e();
                    m = k = null
                }
            });
            f.appendChild(k);
            f.setProgress = function(a) {
                k.style.width = 100 * a + "%"
            }
            ;
            this.addEventListener("video-update", function(a) {
                f.setProgress(a.percentage)
            });
            f.progressElement = k;
            f.progressElementControl = m;
            return f
        },
        createMenuItem: function(a) {
            var b = this
              , c = document.createElement("a");
            c.textContent = a;
            c.style.display = "block";
            c.style.padding = "10px";
            c.style.textDecoration = "none";
            c.style.cursor = "pointer";
            c.style.pointerEvents = "auto";
            c.style.transition = this.DEFAULT_TRANSITION;
            c.slide = function(a) {
                this.style.transform = "translateX(" + (a ? "" : "-") + "100%)"
            }
            ;
            c.unslide = function() {
                this.style.transform = "translateX(0)"
            }
            ;
            c.setIcon = function(a) {
                this.icon && (this.icon.style.backgroundImage = "url(" + a + ")")
            }
            ;
            c.setSelectionTitle = function(a) {
                this.selection && (this.selection.textContent = a)
            }
            ;
            c.addSelection = function(a) {
                var b = document.createElement("span");
                b.style.fontSize = "13px";
                b.style.fontWeight = "300";
                b.style.float = "right";
                this.selection = b;
                this.setSelectionTitle(a);
                this.appendChild(b);
                return this
            }
            ;
            c.addIcon = function(a, b, c) {
                a = void 0 === a ? t.ChevronRight : a;
                b = void 0 === b ? !1 : b;
                c = void 0 === c ? !1 : c;
                var e = document.createElement("span");
                e.style.float = b ? "left" : "right";
                e.style.width = "17px";
                e.style.height = "17px";
                e.style["margin" + (b ? "Right" : "Left")] = "12px";
                e.style.backgroundSize = "cover";
                c && (e.style.transform = "rotateZ(180deg)");
                this.icon = e;
                this.setIcon(a);
                this.appendChild(e);
                return this
            }
            ;
            c.addSubMenu = function(a, c) {
                this.subMenu = b.createSubMenu(a, c);
                return this
            }
            ;
            c.addEventListener("mouseenter", function() {
                this.style.backgroundColor = "#e0e0e0"
            }, !1);
            c.addEventListener("mouseleave", function() {
                this.style.backgroundColor = "#fafafa"
            }, !1);
            return c
        },
        createMenuItemHeader: function(a) {
            a = this.createMenuItem(a);
            a.style.borderBottom = "1px solid #333";
            a.style.paddingBottom = "15px";
            return a
        },
        createMainMenu: function(a) {
            function b(a) {
                a.preventDefault();
                a.stopPropagation();
                var b = c.mainMenu
                  , e = this.subMenu;
                b.hide();
                b.slideAll();
                b.parentElement.appendChild(e);
                c.activeMainItem = this;
                c.activeSubMenu = e;
                window.requestAnimationFrame(function() {
                    b.changeSize(e.clientWidth);
                    e.show();
                    e.unslideAll()
                })
            }
            var c = this
              , e = this.createMenu();
            e._width = 200;
            e.changeSize(e._width);
            for (var d = 0; d < a.length; d++) {
                var h = e.addItem(a[d].title);
                h.style.paddingLeft = "20px";
                h.addIcon().addEventListener(c.TOUCH_ENABLED ? "touchend" : "click", b, !1);
                a[d].subMenu && 0 < a[d].subMenu.length && h.addSelection(a[d].subMenu[0].title).addSubMenu(a[d].title, a[d].subMenu)
            }
            return e
        },
        createSubMenu: function(a, b) {
            function c(a) {
                a.preventDefault();
                a.stopPropagation();
                d = e.mainMenu;
                d.changeSize(d._width);
                d.unslideAll();
                d.show();
                h.slideAll(!0);
                h.hide();
                "header" !== this.type && (h.setActiveItem(this),
                e.activeMainItem.setSelectionTitle(this.textContent),
                this.handler && this.handler())
            }
            var e = this, d, h = this.createMenu();
            h.items = b;
            h.activeItem = null;
            h.addHeader(a).addIcon(void 0, !0, !0).addEventListener(e.TOUCH_ENABLED ? "touchend" : "click", c, !1);
            for (a = 0; a < b.length; a++) {
                var k = h.addItem(b[a].title);
                k.style.fontWeight = 300;
                k.handler = b[a].handler;
                k.addIcon(" ", !0);
                k.addEventListener(e.TOUCH_ENABLED ? "touchend" : "click", c, !1);
                h.activeItem || h.setActiveItem(k)
            }
            h.slideAll(!0);
            return h
        },
        createMenu: function() {
            var a = this
              , b = document.createElement("span")
              , c = b.style;
            c.padding = "5px 0";
            c.position = "fixed";
            c.bottom = "100%";
            c.right = "14px";
            c.backgroundColor = "#fafafa";
            c.fontFamily = "Helvetica Neue";
            c.fontSize = "14px";
            c.visibility = "hidden";
            c.opacity = 0;
            c.boxShadow = "0 0 12pt rgba(0,0,0,0.25)";
            c.borderRadius = "2px";
            c.overflow = "hidden";
            c.willChange = "width, height, opacity";
            c.pointerEvents = "auto";
            c.transition = this.DEFAULT_TRANSITION;
            b.visible = !1;
            b.changeSize = function(a, b) {
                a && (this.style.width = a + "px");
                b && (this.style.height = b + "px")
            }
            ;
            b.show = function() {
                this.style.opacity = 1;
                this.style.visibility = "visible";
                this.visible = !0
            }
            ;
            b.hide = function() {
                this.style.opacity = 0;
                this.style.visibility = "hidden";
                this.visible = !1
            }
            ;
            b.toggle = function() {
                this.visible ? this.hide() : this.show()
            }
            ;
            b.slideAll = function(a) {
                for (var c = 0; c < b.children.length; c++)
                    b.children[c].slide && b.children[c].slide(a)
            }
            ;
            b.unslideAll = function() {
                for (var a = 0; a < b.children.length; a++)
                    b.children[a].unslide && b.children[a].unslide()
            }
            ;
            b.addHeader = function(b) {
                b = a.createMenuItemHeader(b);
                b.type = "header";
                this.appendChild(b);
                return b
            }
            ;
            b.addItem = function(b) {
                b = a.createMenuItem(b);
                b.type = "item";
                this.appendChild(b);
                return b
            }
            ;
            b.setActiveItem = function(a) {
                this.activeItem && this.activeItem.setIcon(" ");
                a.setIcon(t.Check);
                this.activeItem = a
            }
            ;
            b.addEventListener("mousemove", this.PREVENT_EVENT_HANDLER, !0);
            b.addEventListener("mouseup", this.PREVENT_EVENT_HANDLER, !0);
            b.addEventListener("mousedown", this.PREVENT_EVENT_HANDLER, !0);
            return b
        },
        createCustomItem: function(a) {
            a = void 0 === a ? {} : a;
            var b = this
              , c = a.element || document.createElement("span")
              , e = a.onDispose;
            c.style.cursor = "pointer";
            c.style.float = "right";
            c.style.width = "44px";
            c.style.height = "100%";
            c.style.backgroundSize = "60%";
            c.style.backgroundRepeat = "no-repeat";
            c.style.backgroundPosition = "center";
            c.style.webkitUserSelect = c.style.MozUserSelect = c.style.userSelect = "none";
            c.style.position = "relative";
            c.style.pointerEvents = "auto";
            c.addEventListener(b.TOUCH_ENABLED ? "touchstart" : "mouseenter", function() {
                c.style.filter = c.style.webkitFilter = "drop-shadow(0 0 5px rgba(255,255,255,1))"
            }, {
                passive: !0
            });
            c.addEventListener(b.TOUCH_ENABLED ? "touchend" : "mouseleave", function() {
                c.style.filter = c.style.webkitFilter = ""
            }, {
                passive: !0
            });
            this.mergeStyleOptions(c, a.style);
            a.onTap && c.addEventListener(b.TOUCH_ENABLED ? "touchend" : "click", a.onTap, !1);
            c.dispose = function() {
                c.removeEventListener(b.TOUCH_ENABLED ? "touchend" : "click", a.onTap, !1);
                if (e)
                    a.onDispose()
            }
            ;
            return c
        },
        mergeStyleOptions: function(a, b) {
            b = void 0 === b ? {} : b;
            for (var c in b)
                b.hasOwnProperty(c) && (a.style[c] = b[c]);
            return a
        },
        dispose: function() {
            this.barElement && (this.container.removeChild(this.barElement),
            this.barElement.dispose(),
            this.barElement = null)
        }
    });
    var ka = {
        tEquirect: {
            value: new d.Texture
        },
        repeat: {
            value: new d.Vector2(1,1)
        },
        offset: {
            value: new d.Vector2(0,0)
        },
        opacity: {
            value: 1
        }
    };
    r.prototype = Object.assign(Object.create(d.Mesh.prototype), {
        constructor: r,
        createGeometry: function(a) {
            return new d.BoxBufferGeometry(a,a,a)
        },
        createMaterial: function(a, b) {
            a = void 0 === a ? new d.Vector2(1,1) : a;
            b = void 0 === b ? new d.Vector2(0,0) : b;
            var c = d.UniformsUtils.clone(ka);
            c.repeat.value.copy(a);
            c.offset.value.copy(b);
            c.opacity.value = 0;
            return new d.ShaderMaterial({
                fragmentShader: "\n        uniform sampler2D tEquirect;\n        uniform vec2 repeat;\n        uniform vec2 offset;\n        uniform float opacity;\n        varying vec3 vWorldDirection;\n        #include <common>\n        void main() {\n            vec3 direction = normalize( vWorldDirection );\n            vec2 sampleUV;\n            sampleUV.y = asin( clamp( direction.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n            sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;\n            sampleUV *= repeat;\n            sampleUV += offset;\n            vec4 texColor = texture2D( tEquirect, sampleUV );\n            gl_FragColor = mapTexelToLinear( texColor );\n            gl_FragColor.a *= opacity;\n            #include <tonemapping_fragment>\n            #include <encodings_fragment>\n        }\n    ",
                vertexShader: "\n        varying vec3 vWorldDirection;\n        #include <common>\n        void main() {\n            vWorldDirection = transformDirection( position, modelMatrix );\n            #include <begin_vertex>\n            #include <project_vertex>\n        }\n    ",
                uniforms: c,
                side: d.BackSide,
                transparent: !0,
                opacity: 0
            })
        },
        add: function(a) {
            if (1 < arguments.length) {
                for (var b = 0; b < arguments.length; b++)
                    this.add(arguments[b]);
                return this
            }
            a instanceof y && ((b = this.container) && a.dispatchEvent({
                type: "panolens-container",
                container: b
            }),
            a.dispatchEvent({
                type: "panolens-infospot-focus",
                method: function(a, b, d) {
                    this.dispatchEvent({
                        type: "panolens-viewer-handler",
                        method: "tweenControlCenter",
                        data: [a, b, d]
                    })
                }
                .bind(this)
            }));
            d.Object3D.prototype.add.call(this, a)
        },
        getTexture: function() {
            return this.material.uniforms.tEquirect.value
        },
        load: function() {
            this.onLoad()
        },
        onClick: function(a) {
            a.intersects && 0 === a.intersects.length && this.traverse(function(a) {
                a.dispatchEvent({
                    type: "dismiss"
                })
            })
        },
        setContainer: function(a) {
            if (a instanceof HTMLElement)
                var b = a;
            else
                a && a.container && (b = a.container);
            b && (this.children.forEach(function(a) {
                a instanceof y && a.dispatchEvent && a.dispatchEvent({
                    type: "panolens-container",
                    container: b
                })
            }),
            this.container = b)
        },
        onLoad: function() {
            this.loaded = !0;
            this.dispatchEvent({
                type: "load"
            })
        },
        onProgress: function(a) {
            this.dispatchEvent({
                type: "progress",
                progress: a
            })
        },
        onError: function() {
            this.dispatchEvent({
                type: "error"
            })
        },
        getZoomLevel: function() {
            return 800 >= window.innerWidth ? this.ImageQualityFair : 800 < window.innerWidth && 1280 >= window.innerWidth ? this.ImageQualityMedium : 1280 < window.innerWidth && 1920 >= window.innerWidth ? this.ImageQualityHigh : 1920 < window.innerWidth ? this.ImageQualitySuperHigh : this.ImageQualityLow
        },
        updateTexture: function(a) {
            this.material.uniforms.tEquirect.value = a
        },
        toggleInfospotVisibility: function(a, b) {
            b = void 0 !== b ? b : 0;
            var c = void 0 !== a ? a : this.isInfospotVisible ? !1 : !0;
            this.traverse(function(a) {
                a instanceof y && (c ? a.show(b) : a.hide(b))
            });
            this.isInfospotVisible = c;
            this.infospotAnimation.onComplete(function() {
                this.dispatchEvent({
                    type: "infospot-animation-complete",
                    visible: c
                })
            }
            .bind(this)).delay(b).start()
        },
        setLinkingImage: function(a, b) {
            this.linkingImageURL = a;
            this.linkingImageScale = b
        },
        link: function(a, b, c, e) {
            this.visible = !0;
            b ? (c = void 0 !== c ? c : void 0 !== a.linkingImageScale ? a.linkingImageScale : 300,
            e = e ? e : a.linkingImageURL ? a.linkingImageURL : t.Arrow,
            e = new y(c,e),
            e.position.copy(b),
            e.toPanorama = a,
            e.addEventListener("click", function() {
                this.dispatchEvent({
                    type: "panolens-viewer-handler",
                    method: "setPanorama",
                    data: a
                })
            }
            .bind(this)),
            this.linkedSpots.push(e),
            this.add(e),
            this.visible = !1) : console.warn("Please specify infospot position for linking")
        },
        reset: function() {
            this.children.length = 0
        },
        setupTransitions: function() {
            this.fadeInAnimation = (new m.Tween(this.material)).easing(m.Easing.Quartic.Out).onStart(function() {
                this.visible = !0;
                this.dispatchEvent({
                    type: "enter-fade-start"
                })
            }
            .bind(this));
            this.fadeOutAnimation = (new m.Tween(this.material)).easing(m.Easing.Quartic.Out).onComplete(function() {
                this.visible = !1;
                this.dispatchEvent({
                    type: "leave-complete"
                })
            }
            .bind(this));
            this.enterTransition = (new m.Tween(this)).easing(m.Easing.Quartic.Out).onComplete(function() {
                this.dispatchEvent({
                    type: "enter-complete"
                })
            }
            .bind(this)).start();
            this.leaveTransition = (new m.Tween(this)).easing(m.Easing.Quartic.Out)
        },
        onFadeAnimationUpdate: function() {
            var a = this.material.opacity
              , b = this.material.uniforms;
            b && b.opacity && (b.opacity.value = a)
        },
        fadeIn: function(a) {
            a = 0 <= a ? a : this.animationDuration;
            this.fadeOutAnimation.stop();
            this.fadeInAnimation.to({
                opacity: 1
            }, a).onUpdate(this.onFadeAnimationUpdate.bind(this)).onComplete(function() {
                this.toggleInfospotVisibility(!0, a / 2);
                this.dispatchEvent({
                    type: "enter-fade-complete"
                })
            }
            .bind(this)).start()
        },
        fadeOut: function(a) {
            a = 0 <= a ? a : this.animationDuration;
            this.fadeInAnimation.stop();
            this.fadeOutAnimation.to({
                opacity: 0
            }, a).onUpdate(this.onFadeAnimationUpdate.bind(this)).start()
        },
        onEnter: function() {
            var a = this.animationDuration;
            this.dispatchEvent({
                type: "enter"
            });
            this.leaveTransition.stop();
            this.enterTransition.to({}, a).onStart(function() {
                this.dispatchEvent({
                    type: "enter-start"
                });
                this.loaded ? this.fadeIn(a) : this.load()
            }
            .bind(this)).start();
            this.children.forEach(function(a) {
                a.dispatchEvent({
                    type: "panorama-enter"
                })
            });
            this.active = !0
        },
        onLeave: function() {
            var a = this.animationDuration;
            this.enterTransition.stop();
            this.leaveTransition.to({}, a).onStart(function() {
                this.dispatchEvent({
                    type: "leave-start"
                });
                this.fadeOut(a);
                this.toggleInfospotVisibility(!1)
            }
            .bind(this)).start();
            this.dispatchEvent({
                type: "leave"
            });
            this.children.forEach(function(a) {
                a.dispatchEvent({
                    type: "panorama-leave"
                })
            });
            this.active = !1
        },
        dispose: function() {
            function a(b) {
                for (var c = b.geometry, d = b.material, h = b.children.length - 1; 0 <= h; h--)
                    a(b.children[h]),
                    b.remove(b.children[h]);
                b instanceof y && b.dispose();
                c && (c.dispose(),
                b.geometry = null);
                d && (d.dispose(),
                b.material = null)
            }
            var b = this.material;
            b && b.uniforms && b.uniforms.tEquirect && b.uniforms.tEquirect.value.dispose();
            this.infospotAnimation.stop();
            this.fadeInAnimation.stop();
            this.fadeOutAnimation.stop();
            this.enterTransition.stop();
            this.leaveTransition.stop();
            this.dispatchEvent({
                type: "panolens-viewer-handler",
                method: "onPanoramaDispose",
                data: this
            });
            a(this);
            this.parent && this.parent.remove(this)
        }
    });
    u.prototype = Object.assign(Object.create(r.prototype), {
        constructor: u,
        load: function(a) {
            a = a || this.src;
            if (!a)
                console.warn("Image source undefined");
            else if ("string" === typeof a)
                K.load(a, this.onLoad.bind(this), this.onProgress.bind(this), this.onError.bind(this));
            else if (a instanceof HTMLImageElement)
                this.onLoad(new d.Texture(a))
        },
        onLoad: function(a) {
            a.minFilter = a.magFilter = d.LinearFilter;
            a.needsUpdate = !0;
            this.updateTexture(a);
            window.requestAnimationFrame(r.prototype.onLoad.bind(this))
        },
        reset: function() {
            r.prototype.reset.call(this)
        },
        dispose: function() {
            d.Cache.remove(this.src);
            r.prototype.dispose.call(this)
        }
    });
    R.prototype = Object.assign(Object.create(r.prototype), {
        constructor: R,
        createGeometry: function() {
            var a = new d.BufferGeometry;
            a.addAttribute("position", new d.BufferAttribute(new Float32Array,1));
            return a
        },
        createMaterial: function() {
            new d.MeshBasicMaterial({
                color: 0,
                opacity: 0,
                transparent: !0
            })
        },
        getTexture: function() {
            return null
        }
    });
    M.prototype = Object.assign(Object.create(r.prototype), {
        constructor: M,
        createMaterial: function() {
            var a = d.ShaderLib.cube
              , b = a.fragmentShader
              , c = a.vertexShader;
            a = d.UniformsUtils.clone(a.uniforms);
            a.opacity.value = 0;
            return new d.ShaderMaterial({
                fragmentShader: b,
                vertexShader: c,
                uniforms: a,
                side: d.BackSide,
                transparent: !0,
                opacity: 0
            })
        },
        load: function() {
            ha.load(this.images, this.onLoad.bind(this), this.onProgress.bind(this), this.onError.bind(this))
        },
        onLoad: function(a) {
            this.material.uniforms.tCube.value = a;
            r.prototype.onLoad.call(this)
        },
        getTexture: function() {
            return this.material.uniforms.tCube.value
        },
        dispose: function() {
            var a = this.material.uniforms.tCube.value;
            this.images.forEach(function(a) {
                d.Cache.remove(a)
            });
            a instanceof d.CubeTexture && a.dispose();
            r.prototype.dispose.call(this)
        }
    });
    S.prototype = Object.assign(Object.create(M.prototype), {
        constructor: S
    });
    z.prototype = Object.assign(Object.create(r.prototype), {
        constructor: z,
        isMobile: function() {
            var a = !1
              , b = window.navigator.userAgent || window.navigator.vendor || window.opera;
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0, 4)))
                a = !0;
            return a
        },
        load: function() {
            var a = this.options
              , b = a.muted
              , c = a.loop
              , e = a.autoplay
              , d = a.playsinline;
            a = a.crossOrigin;
            var h = this.videoElement
              , k = this.onProgress.bind(this)
              , m = this.onLoad.bind(this);
            h.loop = c;
            h.autoplay = e;
            h.playsinline = d;
            h.crossOrigin = a;
            h.muted = b;
            d && (h.setAttribute("playsinline", ""),
            h.setAttribute("webkit-playsinline", ""));
            d = function() {
                var a = this.setVideoTexture(h);
                e && this.dispatchEvent({
                    type: "panolens-viewer-handler",
                    method: "updateVideoPlayButton",
                    data: !1
                });
                this.isMobile() && (h.pause(),
                e && b ? this.dispatchEvent({
                    type: "panolens-viewer-handler",
                    method: "updateVideoPlayButton",
                    data: !1
                }) : this.dispatchEvent({
                    type: "panolens-viewer-handler",
                    method: "updateVideoPlayButton",
                    data: !0
                }));
                window.requestAnimationFrame(function() {
                    k({
                        loaded: 1,
                        total: 1
                    });
                    m(a)
                })
            }
            ;
            2 < h.readyState ? d.call(this) : (0 === h.querySelectorAll("source").length && (a = document.createElement("source"),
            a.src = this.src,
            h.appendChild(a)),
            h.load());
            h.addEventListener("loadeddata", d.bind(this));
            h.addEventListener("timeupdate", function() {
                this.videoProgress = 0 <= h.duration ? h.currentTime / h.duration : 0;
                this.dispatchEvent({
                    type: "panolens-viewer-handler",
                    method: "onVideoUpdate",
                    data: this.videoProgress
                })
            }
            .bind(this));
            h.addEventListener("ended", function() {
                c || (this.resetVideo(),
                this.dispatchEvent({
                    type: "panolens-viewer-handler",
                    method: "updateVideoPlayButton",
                    data: !0
                }))
            }
            .bind(this), !1)
        },
        onLoad: function() {
            r.prototype.onLoad.call(this)
        },
        setVideoTexture: function(a) {
            if (a)
                return a = new d.VideoTexture(a),
                a.minFilter = d.LinearFilter,
                a.magFilter = d.LinearFilter,
                a.format = d.RGBFormat,
                this.updateTexture(a),
                a
        },
        reset: function() {
            this.videoElement = void 0;
            r.prototype.reset.call(this)
        },
        isVideoPaused: function() {
            return this.videoElement.paused
        },
        toggleVideo: function() {
            var a = this.videoElement;
            if (a)
                a[a.paused ? "play" : "pause"]()
        },
        setVideoCurrentTime: function(a) {
            a = a.percentage;
            var b = this.videoElement;
            b && !Number.isNaN(a) && 1 !== a && (b.currentTime = b.duration * a,
            this.dispatchEvent({
                type: "panolens-viewer-handler",
                method: "onVideoUpdate",
                data: a
            }))
        },
        playVideo: function() {
            var a = this.videoElement
              , b = this.playVideo.bind(this)
              , c = this.dispatchEvent.bind(this)
              , e = function() {
                c({
                    type: "play"
                })
            }
              , d = function(a) {
                window.requestAnimationFrame(b);
                c({
                    type: "play-error",
                    error: a
                })
            };
            a && a.paused && a.play().then(e).catch(d)
        },
        pauseVideo: function() {
            var a = this.videoElement;
            a && !a.paused && a.pause();
            this.dispatchEvent({
                type: "pause"
            })
        },
        resumeVideoProgress: function() {
            var a = this.videoElement;
            4 <= a.readyState && a.autoplay && !this.isMobile() ? (this.playVideo(),
            this.dispatchEvent({
                type: "panolens-viewer-handler",
                method: "updateVideoPlayButton",
                data: !1
            })) : (this.pauseVideo(),
            this.dispatchEvent({
                type: "panolens-viewer-handler",
                method: "updateVideoPlayButton",
                data: !0
            }));
            this.setVideoCurrentTime({
                percentage: this.videoProgress
            })
        },
        resetVideo: function() {
            this.videoElement && this.setVideoCurrentTime({
                percentage: 0
            })
        },
        isVideoMuted: function() {
            return this.videoElement.muted
        },
        muteVideo: function() {
            var a = this.videoElement;
            a && !a.muted && (a.muted = !0);
            this.dispatchEvent({
                type: "volumechange"
            })
        },
        unmuteVideo: function() {
            var a = this.videoElement;
            a && this.isVideoMuted() && (a.muted = !1);
            this.dispatchEvent({
                type: "volumechange"
            })
        },
        getVideoElement: function() {
            return this.videoElement
        },
        dispose: function() {
            this.pauseVideo();
            this.removeEventListener("leave", this.pauseVideo.bind(this));
            this.removeEventListener("enter-fade-start", this.resumeVideoProgress.bind(this));
            this.removeEventListener("video-toggle", this.toggleVideo.bind(this));
            this.removeEventListener("video-time", this.setVideoCurrentTime.bind(this));
            r.prototype.dispose.call(this)
        }
    });
    Object.assign(Z.prototype, {
        constructor: Z,
        setProgress: function(a, b) {
            if (this.onProgress)
                this.onProgress({
                    loaded: a,
                    total: b
                })
        },
        adaptTextureToZoom: function() {
            var a = this.widths[this._zoom]
              , b = this.heights[this._zoom]
              , c = this.maxW
              , e = this.maxH;
            this._wc = Math.ceil(a / c);
            this._hc = Math.ceil(b / e);
            for (var d = 0; d < this._hc; d++)
                for (var h = 0; h < this._wc; h++) {
                    var k = document.createElement("canvas");
                    k.width = h < this._wc - 1 ? c : a - c * h;
                    k.height = d < this._hc - 1 ? e : b - e * d;
                    this._canvas.push(k);
                    this._ctx.push(k.getContext("2d"))
                }
        },
        composeFromTile: function(a, b, c) {
            var e = this.maxW
              , d = this.maxH;
            a *= 512;
            b *= 512;
            var h = Math.floor(a / e)
              , k = Math.floor(b / d);
            this._ctx[k * this._wc + h].drawImage(c, 0, 0, c.width, c.height, a - h * e, b - k * d, 512, 512);
            this.progress()
        },
        progress: function() {
            this._count++;
            this.setProgress(this._count, this._total);
            if (this._count === this._total && (this.canvas = this._canvas,
            this.panoId = this._panoId,
            this.zoom = this._zoom,
            this.onPanoramaLoad))
                this.onPanoramaLoad(this._canvas[0])
        },
        composePanorama: function() {
            this.setProgress(0, 1);
            var a = this.levelsW[this._zoom]
              , b = this.levelsH[this._zoom]
              , c = this;
            this._count = 0;
            this._total = a * b;
            for (var e = this._parameters.useWebGL, d = 0; d < b; d++)
                for (var h = {}, k = 0; k < a; h = {
                    $jscomp$loop$prop$url$2: h.$jscomp$loop$prop$url$2
                },
                k++)
                    h.$jscomp$loop$prop$url$2 = "https://geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&authuser=0&hl=en&output=tile&zoom=" + this._zoom + "&x=" + k + "&y=" + d + "&panoid=" + this._panoId + "&nbt&fover=2",
                    function(a) {
                        return function(b, d) {
                            if (e)
                                var g = K.load(a.$jscomp$loop$prop$url$2, null, function() {
                                    c.composeFromTile(b, d, g)
                                });
                            else {
                                var f = new Image;
                                f.addEventListener("load", function() {
                                    c.composeFromTile(b, d, this)
                                });
                                f.crossOrigin = "";
                                f.src = a.$jscomp$loop$prop$url$2
                            }
                        }
                    }(h)(k, d)
        },
        load: function(a) {
            this.loadPano(a)
        },
        loadPano: function(a) {
            var b = this;
            this._panoClient.getPanoramaById(a, function(a, e) {
                e === google.maps.StreetViewStatus.OK && (b.result = a,
                b.copyright = a.copyright,
                b._panoId = a.location.pano,
                b.composePanorama())
            })
        },
        setZoom: function(a) {
            this._zoom = a;
            this.adaptTextureToZoom()
        }
    });
    aa.prototype = Object.assign(Object.create(u.prototype), {
        constructor: aa,
        load: function(a) {
            this.loadRequested = !0;
            (a = a || this.panoId || {},
            this.gsvLoader) && this.loadGSVLoader(a)
        },
        setupGoogleMapAPI: function(a) {
            var b = document.createElement("script");
            b.src = "https://maps.googleapis.com/maps/api/js?";
            b.src += a ? "key=" + a : "";
            b.onreadystatechange = this.setGSVLoader.bind(this);
            b.onload = this.setGSVLoader.bind(this);
            document.querySelector("head").appendChild(b)
        },
        setGSVLoader: function() {
            this.gsvLoader = new Z;
            this.loadRequested && this.load()
        },
        getGSVLoader: function() {
            return this.gsvLoader
        },
        loadGSVLoader: function(a) {
            this.loadRequested = !1;
            this.gsvLoader.onProgress = this.onProgress.bind(this);
            this.gsvLoader.onPanoramaLoad = this.onLoad.bind(this);
            this.gsvLoader.setZoom(this.getZoomLevel());
            this.gsvLoader.load(a);
            this.gsvLoader.loaded = !0
        },
        onLoad: function(a) {
            u.prototype.onLoad.call(this, new d.Texture(a))
        },
        reset: function() {
            this.gsvLoader = void 0;
            u.prototype.reset.call(this)
        }
    });
    var la = {
        tDiffuse: {
            value: new d.Texture
        },
        resolution: {
            value: 1
        },
        transform: {
            value: new d.Matrix4
        },
        zoom: {
            value: 1
        },
        opacity: {
            value: 1
        }
    };
    B.prototype = Object.assign(Object.create(u.prototype), {
        constructor: B,
        add: function(a) {
            if (1 < arguments.length) {
                for (var b = 0; b < arguments.length; b++)
                    this.add(arguments[b]);
                return this
            }
            a instanceof y && (a.material.depthTest = !1);
            u.prototype.add.call(this, a)
        },
        createGeometry: function(a) {
            return new d.PlaneBufferGeometry(a,.5 * a)
        },
        createMaterial: function(a) {
            a = void 0 === a ? this.edgeLength : a;
            var b = d.UniformsUtils.clone(la);
            b.zoom.value = a;
            b.opacity.value = 0;
            return new d.ShaderMaterial({
                vertexShader: "\n\n        varying vec2 vUv;\n\n        void main() {\n\n            vUv = uv;\n            gl_Position = vec4( position, 1.0 );\n\n        }\n\n    ",
                fragmentShader: "\n\n        uniform sampler2D tDiffuse;\n        uniform float resolution;\n        uniform mat4 transform;\n        uniform float zoom;\n        uniform float opacity;\n\n        varying vec2 vUv;\n\n        const float PI = 3.141592653589793;\n\n        void main(){\n\n            vec2 position = -1.0 +  2.0 * vUv;\n\n            position *= vec2( zoom * resolution, zoom * 0.5 );\n\n            float x2y2 = position.x * position.x + position.y * position.y;\n            vec3 sphere_pnt = vec3( 2. * position, x2y2 - 1. ) / ( x2y2 + 1. );\n\n            sphere_pnt = vec3( transform * vec4( sphere_pnt, 1.0 ) );\n\n            vec2 sampleUV = vec2(\n                (atan(sphere_pnt.y, sphere_pnt.x) / PI + 1.0) * 0.5,\n                (asin(sphere_pnt.z) / PI + 0.5)\n            );\n\n            gl_FragColor = texture2D( tDiffuse, sampleUV );\n            gl_FragColor.a *= opacity;\n\n        }\n    ",
                uniforms: b,
                transparent: !0,
                opacity: 0
            })
        },
        registerMouseEvents: function() {
            this.container.addEventListener("mousedown", this.onMouseDown.bind(this), {
                passive: !0
            });
            this.container.addEventListener("mousemove", this.onMouseMove.bind(this), {
                passive: !0
            });
            this.container.addEventListener("mouseup", this.onMouseUp.bind(this), {
                passive: !0
            });
            this.container.addEventListener("touchstart", this.onMouseDown.bind(this), {
                passive: !0
            });
            this.container.addEventListener("touchmove", this.onMouseMove.bind(this), {
                passive: !0
            });
            this.container.addEventListener("touchend", this.onMouseUp.bind(this), {
                passive: !0
            });
            this.container.addEventListener("mousewheel", this.onMouseWheel.bind(this), {
                passive: !1
            });
            this.container.addEventListener("DOMMouseScroll", this.onMouseWheel.bind(this), {
                passive: !1
            });
            this.container.addEventListener("contextmenu", this.onContextMenu.bind(this), {
                passive: !0
            })
        },
        unregisterMouseEvents: function() {
            this.container.removeEventListener("mousedown", this.onMouseDown.bind(this), !1);
            this.container.removeEventListener("mousemove", this.onMouseMove.bind(this), !1);
            this.container.removeEventListener("mouseup", this.onMouseUp.bind(this), !1);
            this.container.removeEventListener("touchstart", this.onMouseDown.bind(this), !1);
            this.container.removeEventListener("touchmove", this.onMouseMove.bind(this), !1);
            this.container.removeEventListener("touchend", this.onMouseUp.bind(this), !1);
            this.container.removeEventListener("mousewheel", this.onMouseWheel.bind(this), !1);
            this.container.removeEventListener("DOMMouseScroll", this.onMouseWheel.bind(this), !1);
            this.container.removeEventListener("contextmenu", this.onContextMenu.bind(this), !1)
        },
        onMouseDown: function(a) {
            switch (a.touches && a.touches.length || 1) {
            case 1:
                var b = 0 <= a.clientX ? a.clientX : a.touches[0].clientX;
                a = 0 <= a.clientY ? a.clientY : a.touches[0].clientY;
                this.dragging = !0;
                this.userMouse.set(b, a);
                break;
            case 2:
                b = a.touches[0].pageX - a.touches[1].pageX,
                a = a.touches[0].pageY - a.touches[1].pageY,
                this.userMouse.pinchDistance = Math.sqrt(b * b + a * a)
            }
            this.onUpdateCallback()
        },
        onMouseMove: function(a) {
            switch (a.touches && a.touches.length || 1) {
            case 1:
                var b = 0 <= a.clientX ? a.clientX : a.touches[0].clientX;
                a = 0 <= a.clientY ? a.clientY : a.touches[0].clientY;
                var c = .4 * d.Math.degToRad(b - this.userMouse.x)
                  , e = .4 * d.Math.degToRad(a - this.userMouse.y);
                this.dragging && (this.quatA.setFromAxisAngle(this.vectorY, c),
                this.quatB.setFromAxisAngle(this.vectorX, e),
                this.quatCur.multiply(this.quatA).multiply(this.quatB),
                this.userMouse.set(b, a));
                break;
            case 2:
                b = a.touches[0].pageX - a.touches[1].pageX,
                a = a.touches[0].pageY - a.touches[1].pageY,
                this.addZoomDelta(this.userMouse.pinchDistance - Math.sqrt(b * b + a * a))
            }
        },
        onMouseUp: function() {
            this.dragging = !1
        },
        onMouseWheel: function(a) {
            a.preventDefault();
            a.stopPropagation();
            var b = 0;
            void 0 !== a.wheelDelta ? b = a.wheelDelta : void 0 !== a.detail && (b = -a.detail);
            this.addZoomDelta(b);
            this.onUpdateCallback()
        },
        addZoomDelta: function(a) {
            var b = this.material.uniforms
              , c = .1 * this.size
              , e = 10 * this.size;
            b.zoom.value += a;
            b.zoom.value <= c ? b.zoom.value = c : b.zoom.value >= e && (b.zoom.value = e)
        },
        onUpdateCallback: function() {
            this.frameId = window.requestAnimationFrame(this.onUpdateCallback.bind(this));
            this.quatSlerp.slerp(this.quatCur, .1);
            this.material && this.material.uniforms.transform.value.makeRotationFromQuaternion(this.quatSlerp);
            !this.dragging && 1 - this.quatSlerp.clone().dot(this.quatCur) < this.EPS && window.cancelAnimationFrame(this.frameId)
        },
        reset: function() {
            this.quatCur.set(0, 0, 0, 1);
            this.quatSlerp.set(0, 0, 0, 1);
            this.onUpdateCallback()
        },
        updateTexture: function(a) {
            this.material.uniforms.tDiffuse.value = a
        },
        getTexture: function() {
            return this.material.uniforms.tDiffuse.value
        },
        onLoad: function(a) {
            this.material.uniforms.resolution.value = this.container.clientWidth / this.container.clientHeight;
            this.registerMouseEvents();
            this.onUpdateCallback();
            this.dispatchEvent({
                type: "panolens-viewer-handler",
                method: "disableControl"
            });
            u.prototype.onLoad.call(this, a)
        },
        onLeave: function() {
            this.unregisterMouseEvents();
            this.dispatchEvent({
                type: "panolens-viewer-handler",
                method: "enableControl",
                data: E.ORBIT
            });
            window.cancelAnimationFrame(this.frameId);
            u.prototype.onLeave.call(this)
        },
        onWindowResize: function() {
            this.material.uniforms.resolution.value = this.container.clientWidth / this.container.clientHeight
        },
        onContextMenu: function() {
            this.dragging = !1
        },
        dispose: function() {
            this.unregisterMouseEvents();
            u.prototype.dispose.call(this)
        }
    });
    ba.prototype = Object.assign(Object.create(B.prototype), {
        constructor: ba,
        onLoad: function(a) {
            this.updateTexture(a);
            B.prototype.onLoad.call(this, a)
        },
        updateTexture: function(a) {
            a.minFilter = a.magFilter = d.LinearFilter;
            this.material.uniforms.tDiffuse.value = a
        },
        dispose: function() {
            var a = this.material.uniforms.tDiffuse;
            a && a.value && a.value.dispose();
            B.prototype.dispose.call(this)
        }
    });
    T.prototype = Object.assign(Object.create(r.prototype), {
        constructor: T,
        onPanolensContainer: function(a) {
            this.media.setContainer(a.container)
        },
        onPanolensScene: function(a) {
            this.media.setScene(a.scene)
        },
        start: function() {
            return this.media.start()
        },
        stop: function() {
            this.media.stop()
        }
    });
    N.prototype = Object.assign(Object.create(u.prototype), {
        constructor: N,
        onLoad: function(a) {
            var b = a.image;
            this.stereo.updateUniformByFormat(4 === b.width / b.height ? C.SBS : C.TAB, this.material.uniforms);
            this.material.uniforms.tEquirect.value = a;
            u.prototype.onLoad.call(this, a)
        },
        updateTextureToLeft: function() {
            this.stereo.updateTextureToLeft(this.material.uniforms.offset.value)
        },
        updateTextureToRight: function() {
            this.stereo.updateTextureToRight(this.material.uniforms.offset.value)
        },
        dispose: function() {
            var a = this.material.uniforms.tEquirect.value;
            a instanceof d.Texture && a.dispose();
            u.prototype.dispose.call(this)
        }
    });
    G.prototype = Object.assign(Object.create(z.prototype), {
        constructor: G,
        onLoad: function(a) {
            var b = a.image;
            this.stereo.updateUniformByFormat(4 === b.videoWidth / b.videoHeight ? C.SBS : C.TAB, this.material.uniforms);
            this.material.uniforms.tEquirect.value = a;
            z.prototype.onLoad.call(this)
        },
        updateTextureToLeft: function() {
            this.stereo.updateTextureToLeft(this.material.uniforms.offset.value)
        },
        updateTextureToRight: function() {
            this.stereo.updateTextureToRight(this.material.uniforms.offset.value)
        },
        dispose: function() {
            var a = this.material.uniforms.tEquirect.value;
            a instanceof d.Texture && a.dispose();
            z.prototype.dispose.call(this)
        }
    });
    ca.prototype = Object.assign(Object.create(d.EventDispatcher.prototype), {
        constructor: ca
    });
    da.prototype = Object.assign(Object.create(d.EventDispatcher.prototype), {
        constructor: da
    });
    var ma = function(a) {
        var b = new d.StereoCamera;
        b.aspect = .5;
        var c = new d.Vector2;
        this.setEyeSeparation = function(a) {
            b.eyeSep = a
        }
        ;
        this.setSize = function(b, c) {
            a.setSize(b, c)
        }
        ;
        this.render = function(e, d, h) {
            var g = h instanceof N || h instanceof G;
            e.updateMatrixWorld();
            null === d.parent && d.updateMatrixWorld();
            g && this.setEyeSeparation(h.stereo.eyeSep);
            b.update(d);
            a.getSize(c);
            a.autoClear && a.clear();
            a.setScissorTest(!0);
            g && h.updateTextureToLeft();
            a.setScissor(0, 0, c.width / 2, c.height);
            a.setViewport(0, 0, c.width / 2, c.height);
            a.render(e, b.cameraL);
            g && h.updateTextureToRight();
            a.setScissor(c.width / 2, 0, c.width / 2, c.height);
            a.setViewport(c.width / 2, 0, c.width / 2, c.height);
            a.render(e, b.cameraR);
            a.setScissorTest(!1);
            g && h.updateTextureToLeft()
        }
    };
    ea.prototype = Object.assign(Object.create(d.EventDispatcher.prototype), {
        constructor: ea,
        setupScene: function(a) {
            return a = void 0 === a ? new d.Scene : a
        },
        setupCamera: function(a, b, c) {
            return c = void 0 === c ? new d.PerspectiveCamera(a,b,1,1E4) : c
        },
        setupRenderer: function(a, b) {
            a = void 0 === a ? new d.WebGLRenderer({
                alpha: !0,
                antialias: !1
            }) : a;
            var c = b.clientWidth
              , e = b.clientHeight;
            a.setPixelRatio(window.devicePixelRatio);
            a.setSize(c, e);
            a.setClearColor(0, 0);
            a.autoClear = !1;
            a.domElement.classList.add("panolens-canvas");
            a.domElement.style.display = "block";
            b.style.backgroundColor = "#000";
            b.appendChild(a.domElement);
            return a
        },
        setupControls: function(a, b) {
            var c = this.options
              , e = c.autoRotate
              , d = c.autoRotateSpeed
              , h = c.horizontalView;
            c = new ca(a,b);
            c.id = "orbit";
            c.index = E.ORBIT;
            c.minDistance = 1;
            c.noPan = !0;
            c.autoRotate = e;
            c.autoRotateSpeed = d;
            h && (c.minPolarAngle = Math.PI / 2,
            c.maxPolarAngle = Math.PI / 2);
            a = new da(a,b);
            a.id = "device-orientation";
            a.index = E.DEVICEORIENTATION;
            a.enabled = !1;
            this.controls = [c, a];
            this.OrbitControls = c;
            this.DeviceOrientationControls = a;
            return c
        },
        setupEffects: function(a, b) {
            var c = b.clientWidth;
            b = b.clientHeight;
            var e = new ia(a);
            e.setSize(c, b);
            a = new ma(a);
            a.setSize(c, b);
            this.CardboardEffect = e;
            this.StereoEffect = a;
            return e
        },
        setupContainer: function(a) {
            if (a)
                return a._width = a.clientWidth,
                a._height = a.clientHeight,
                a;
            a = document.createElement("div");
            a.classList.add("panolens-container");
            a.style.width = "100%";
            a.style.height = "100%";
            document.body.appendChild(a);
            return a
        },
        add: function(a) {
            if (1 < arguments.length) {
                for (var b = 0; b < arguments.length; b++)
                    this.add(arguments[b]);
                return this
            }
            this.scene.add(a);
            a.addEventListener && a.addEventListener("panolens-viewer-handler", this.eventHandler.bind(this));
            a instanceof r && a.dispatchEvent && a.dispatchEvent({
                type: "panolens-container",
                container: this.container
            });
            a instanceof T && a.dispatchEvent({
                type: "panolens-scene",
                scene: this.scene
            });
            a instanceof r && (this.addPanoramaEventListener(a),
            this.panorama || (b = this.options.initialLookAt,
            this.setPanorama(a),
            this.setControlCenter(b)))
        },
        remove: function(a) {
            a.removeEventListener && a.removeEventListener("panolens-viewer-handler", this.eventHandler.bind(this));
            this.scene.remove(a)
        },
        addDefaultControlBar: function(a) {
            if (this.widget)
                console.warn("Default control bar exists");
            else {
                var b = new L(this.container);
                b.addEventListener("panolens-viewer-handler", this.eventHandler.bind(this));
                b.addControlBar();
                a.forEach(function(a) {
                    b.addControlButton(a)
                });
                this.widget = b
            }
        },
        setPanorama: function(a) {
            var b = this.panorama;
            if (a instanceof r && b !== a) {
                this.hideInfospot();
                var c = function() {
                    if (b)
                        b.onLeave();
                    a.removeEventListener("enter-fade-start", c)
                };
                a.addEventListener("enter-fade-start", c);
                (this.panorama = a).onEnter()
            }
        },
        eventHandler: function(a) {
            if (a.method && this[a.method])
                this[a.method](a.data)
        },
        dispatchEventToChildren: function(a) {
            this.scene.traverse(function(b) {
                b.dispatchEvent && b.dispatchEvent(a)
            })
        },
        activateWidgetItem: function(a, b) {
            var c = this.widget.mainMenu
              , e = c.children[0];
            c = c.children[1];
            if (void 0 !== a) {
                switch (a) {
                case 0:
                    a = e.subMenu.children[1];
                    break;
                case 1:
                    a = e.subMenu.children[2];
                    break;
                default:
                    a = e.subMenu.children[1]
                }
                e.subMenu.setActiveItem(a);
                e.setSelectionTitle(a.textContent)
            }
            if (void 0 !== b) {
                switch (b) {
                case q.CARDBOARD:
                    a = c.subMenu.children[2];
                    break;
                case q.STEREO:
                    a = c.subMenu.children[3];
                    break;
                default:
                    a = c.subMenu.children[1]
                }
                c.subMenu.setActiveItem(a);
                c.setSelectionTitle(a.textContent)
            }
        },
        enableEffect: function(a) {
            if (this.mode !== a)
                if (a === q.NORMAL)
                    this.disableEffect();
                else {
                    this.mode = a;
                    var b = this.camera.fov;
                    switch (a) {
                    case q.CARDBOARD:
                        this.effect = this.CardboardEffect;
                        this.enableReticleControl();
                        break;
                    case q.STEREO:
                        this.effect = this.StereoEffect;
                        this.enableReticleControl();
                        break;
                    default:
                        this.effect = null,
                        this.disableReticleControl()
                    }
                    this.activateWidgetItem(void 0, this.mode);
                    this.dispatchEventToChildren({
                        type: "panolens-dual-eye-effect",
                        mode: this.mode
                    });
                    this.camera.fov = b + .01;
                    this.effect.setSize(this.container.clientWidth, this.container.clientHeight);
                    this.render();
                    this.camera.fov = b;
                    this.dispatchEvent({
                        type: "mode-change",
                        mode: this.mode
                    })
                }
        },
        disableEffect: function() {
            this.mode !== q.NORMAL && (this.mode = q.NORMAL,
            this.disableReticleControl(),
            this.activateWidgetItem(void 0, this.mode),
            this.dispatchEventToChildren({
                type: "panolens-dual-eye-effect",
                mode: this.mode
            }),
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight),
            this.render(),
            this.dispatchEvent({
                type: "mode-change",
                mode: this.mode
            }))
        },
        enableReticleControl: function() {
            this.reticle.visible || (this.tempEnableReticle = !0,
            this.unregisterMouseAndTouchEvents(),
            this.reticle.show(),
            this.registerReticleEvent(),
            this.updateReticleEvent())
        },
        disableReticleControl: function() {
            this.tempEnableReticle = !1;
            this.options.enableReticle ? this.updateReticleEvent() : (this.reticle.hide(),
            this.unregisterReticleEvent(),
            this.registerMouseAndTouchEvents())
        },
        enableAutoRate: function() {
            this.options.autoRotate = !0;
            this.OrbitControls.autoRotate = !0
        },
        disableAutoRate: function() {
            clearTimeout(this.autoRotateRequestId);
            this.options.autoRotate = !1;
            this.OrbitControls.autoRotate = !1
        },
        toggleVideoPlay: function(a) {
            this.panorama instanceof z && this.panorama.dispatchEvent({
                type: "video-toggle",
                pause: a
            })
        },
        setVideoCurrentTime: function(a) {
            this.panorama instanceof z && this.panorama.dispatchEvent({
                type: "video-time",
                percentage: a
            })
        },
        onVideoUpdate: function(a) {
            var b = this.widget;
            b && b.dispatchEvent({
                type: "video-update",
                percentage: a
            })
        },
        addUpdateCallback: function(a) {
            a && this.updateCallbacks.push(a)
        },
        removeUpdateCallback: function(a) {
            var b = this.updateCallbacks.indexOf(a);
            a && 0 <= b && this.updateCallbacks.splice(b, 1)
        },
        showVideoWidget: function() {
            var a = this.widget;
            a && a.dispatchEvent({
                type: "video-control-show"
            })
        },
        hideVideoWidget: function() {
            var a = this.widget;
            a && a.dispatchEvent({
                type: "video-control-hide"
            })
        },
        updateVideoPlayButton: function(a) {
            var b = this.widget;
            b && b.videoElement && b.videoElement.controlButton && b.videoElement.controlButton.update(a)
        },
        addPanoramaEventListener: function(a) {
            a.addEventListener("enter", this.setCameraControl.bind(this));
            a instanceof z && (a.addEventListener("enter-fade-start", this.showVideoWidget.bind(this)),
            a.addEventListener("leave", function() {
                this.panorama instanceof z || this.hideVideoWidget.call(this)
            }
            .bind(this)))
        },
        setCameraControl: function() {
            this.OrbitControls.target.copy(this.panorama.position)
        },
        getControl: function() {
            return this.control
        },
        getScene: function() {
            return this.scene
        },
        getCamera: function() {
            return this.camera
        },
        getRenderer: function() {
            return this.renderer
        },
        getContainer: function() {
            return this.container
        },
        getControlId: function() {
            return this.control.id
        },
        getNextControlId: function() {
            return this.controls[this.getNextControlIndex()].id
        },
        getNextControlIndex: function() {
            var a = this.controls
              , b = a.indexOf(this.control) + 1;
            return b >= a.length ? 0 : b
        },
        setCameraFov: function(a) {
            this.camera.fov = a;
            this.camera.updateProjectionMatrix()
        },
        getRaycastViewCenter: function() {
            var a = new d.Raycaster;
            a.setFromCamera(new d.Vector2(0,0), this.camera);
            a = a.intersectObject(this.panorama);
            return 0 < a.length ? a[0].point : new d.Vector3(0,0,-1)
        },
        enableControl: function(a) {
            a = 0 <= a && a < this.controls.length ? a : 0;
            this.control.enabled = !1;
            this.control = this.controls[a];
            this.control.enabled = !0;
            this.control.update();
            this.setControlCenter(this.getRaycastViewCenter());
            this.activateWidgetItem(a, void 0);
            this.onChange()
        },
        disableControl: function() {
            this.control.enabled = !1
        },
        toggleNextControl: function() {
            this.enableControl(this.getNextControlIndex())
        },
        getScreenVector: function(a) {
            a = a.clone();
            var b = this.container.clientWidth / 2
              , c = this.container.clientHeight / 2;
            a.project(this.camera);
            a.x = a.x * b + b;
            a.y = -(a.y * c) + c;
            a.z = 0;
            return a
        },
        checkSpriteInViewport: function(a) {
            this.camera.matrixWorldInverse.getInverse(this.camera.matrixWorld);
            this.cameraViewProjectionMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
            this.cameraFrustum.setFromMatrix(this.cameraViewProjectionMatrix);
            return a.visible && this.cameraFrustum.intersectsSprite(a)
        },
        reverseDraggingDirection: function() {
            this.OrbitControls.rotateSpeed *= -1;
            this.OrbitControls.momentumScalingFactor *= -1
        },
        addReticle: function(a, b) {
            var c = new J(16777215,!0,this.options.dwellTime);
            c.hide();
            a.add(c);
            b.add(a);
            return c
        },
        rotateControlLeft: function(a) {
            this.control.rotateLeft(a)
        },
        rotateControlUp: function(a) {
            this.control.rotateUp(a)
        },
        rotateOrbitControl: function(a, b) {
            this.rotateControlLeft(a);
            this.rotateControlUp(b)
        },
        calculateCameraDirectionDelta: function(a) {
            var b = this.camera.getWorldDirection(new d.Vector3);
            var c = b.clone();
            var e = this.panorama.getWorldPosition(new d.Vector3).sub(this.camera.getWorldPosition(new d.Vector3));
            a = a.clone();
            a.add(e).normalize();
            var g = a.clone();
            b.y = 0;
            a.y = 0;
            e = Math.atan2(a.z, a.x) - Math.atan2(b.z, b.x);
            e = e > Math.PI ? e - 2 * Math.PI : e;
            e = e < -Math.PI ? e + 2 * Math.PI : e;
            b = Math.abs(c.angleTo(b) + (0 >= c.y * g.y ? g.angleTo(a) : -g.angleTo(a)));
            b *= g.y < c.y ? 1 : -1;
            return {
                left: e,
                up: b
            }
        },
        setControlCenter: function(a) {
            a = this.calculateCameraDirectionDelta(a);
            this.rotateOrbitControl(a.left, a.up)
        },
        tweenControlCenter: function(a, b, c) {
            a instanceof Array && (a = a[0],
            b = a[1],
            c = a[2]);
            b = void 0 !== b ? b : 1E3;
            c = c || m.Easing.Exponential.Out;
            var e = this.calculateCameraDirectionDelta(a);
            a = e.left;
            e = e.up;
            var d = this.rotateControlLeft.bind(this)
              , h = this.rotateControlUp.bind(this)
              , k = {
                left: 0,
                up: 0
            }
              , n = 0
              , l = 0;
            this.tweenLeftAnimation.stop();
            this.tweenUpAnimation.stop();
            this.tweenLeftAnimation = (new m.Tween(k)).to({
                left: a
            }, b).easing(c).onUpdate(function(a) {
                d(a.left - n);
                n = a.left
            }).start();
            this.tweenUpAnimation = (new m.Tween(k)).to({
                up: e
            }, b).easing(c).onUpdate(function(a) {
                h(a.up - l);
                l = a.up
            }).start()
        },
        tweenControlCenterByObject: function(a, b, c) {
            this.tweenControlCenter(a.getWorldPosition(new d.Vector3), b, c)
        },
        onWindowResize: function(a, b) {
            var c = this.container.classList.contains("panolens-container") || this.container.isFullscreen;
            if (void 0 !== a && void 0 !== b) {
                var e = a;
                var d = b;
                this.container._width = a;
                this.container._height = b
            } else
                a = (b = /(android)/i.test(window.navigator.userAgent)) ? Math.min(document.documentElement.clientWidth, window.innerWidth || 0) : Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
                b = b ? Math.min(document.documentElement.clientHeight, window.innerHeight || 0) : Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
                e = c ? a : this.container.clientWidth,
                d = c ? b : this.container.clientHeight,
                this.container._width = e,
                this.container._height = d;
            this.camera.aspect = e / d;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(e, d);
            (this.options.enableReticle || this.tempEnableReticle) && this.updateReticleEvent();
            this.dispatchEvent({
                type: "window-resize",
                width: e,
                height: d
            });
            this.scene.traverse(function(a) {
                a.dispatchEvent && a.dispatchEvent({
                    type: "window-resize",
                    width: e,
                    height: d
                })
            })
        },
        addOutputElement: function() {
            var a = document.createElement("div");
            a.style.position = "absolute";
            a.style.right = "10px";
            a.style.top = "10px";
            a.style.color = "#fff";
            this.container.appendChild(a);
            this.outputDivElement = a
        },
        outputPosition: function() {
            var a = this.raycaster.intersectObject(this.panorama, !0);
            if (0 < a.length) {
                a = a[0].point.clone();
                var b = this.panorama.getWorldPosition(new d.Vector3);
                a.sub(b);
                b = a.x.toFixed(2) + ", " + a.y.toFixed(2) + ", " + a.z.toFixed(2);
                if (0 !== a.length())
                    switch (this.options.output) {
                    case "console":
                        console.info(b);
                        break;
                    case "overlay":
                        this.outputDivElement.textContent = b
                    }
            }
        },
        onMouseDown: function(a) {
            a.preventDefault();
            this.userMouse.x = 0 <= a.clientX ? a.clientX : a.touches[0].clientX;
            this.userMouse.y = 0 <= a.clientY ? a.clientY : a.touches[0].clientY;
            this.userMouse.type = "mousedown";
            this.onTap(a)
        },
        onMouseMove: function(a) {
            a.preventDefault();
            this.userMouse.type = "mousemove";
            this.onTap(a)
        },
        onMouseUp: function(a) {
            this.userMouse.type = "mouseup";
            var b = this.userMouse.x >= a.clientX - this.options.clickTolerance && this.userMouse.x <= a.clientX + this.options.clickTolerance && this.userMouse.y >= a.clientY - this.options.clickTolerance && this.userMouse.y <= a.clientY + this.options.clickTolerance || a.changedTouches && this.userMouse.x >= a.changedTouches[0].clientX - this.options.clickTolerance && this.userMouse.x <= a.changedTouches[0].clientX + this.options.clickTolerance && this.userMouse.y >= a.changedTouches[0].clientY - this.options.clickTolerance && this.userMouse.y <= a.changedTouches[0].clientY + this.options.clickTolerance ? "click" : void 0;
            if (!a || !a.target || a.target.classList.contains("panolens-canvas"))
                if (a.preventDefault(),
                a = a.changedTouches && 1 === a.changedTouches.length ? this.onTap({
                    clientX: a.changedTouches[0].clientX,
                    clientY: a.changedTouches[0].clientY
                }, b) : this.onTap(a, b),
                this.userMouse.type = "none",
                !a && "click" === b) {
                    b = this.options;
                    a = b.autoHideControlBar;
                    var c = this.panorama
                      , d = this.toggleControlBar;
                    b.autoHideInfospot && c && c.toggleInfospotVisibility();
                    a && d()
                }
        },
        onTap: function(a, b) {
            var c = this.container.getBoundingClientRect()
              , d = c.top
              , g = this.container
              , h = g.clientHeight;
            this.raycasterPoint.x = (a.clientX - c.left) / g.clientWidth * 2 - 1;
            this.raycasterPoint.y = 2 * -((a.clientY - d) / h) + 1;
            this.raycaster.setFromCamera(this.raycasterPoint, this.camera);
            if (this.panorama) {
                ("mousedown" !== a.type && this.touchSupported || this.outputEnabled) && this.outputPosition();
                c = this.raycaster.intersectObjects(this.panorama.children, !0);
                d = this.getConvertedIntersect(c);
                g = 0 < c.length ? c[0].object : void 0;
                "mouseup" === this.userMouse.type && (d && this.pressEntityObject === d && this.pressEntityObject.dispatchEvent && this.pressEntityObject.dispatchEvent({
                    type: "pressstop-entity",
                    mouseEvent: a
                }),
                this.pressEntityObject = void 0);
                "mouseup" === this.userMouse.type && (g && this.pressObject === g && this.pressObject.dispatchEvent && this.pressObject.dispatchEvent({
                    type: "pressstop",
                    mouseEvent: a
                }),
                this.pressObject = void 0);
                if ("click" === b)
                    this.panorama.dispatchEvent({
                        type: "click",
                        intersects: c,
                        mouseEvent: a
                    }),
                    d && d.dispatchEvent && d.dispatchEvent({
                        type: "click-entity",
                        mouseEvent: a
                    }),
                    g && g.dispatchEvent && g.dispatchEvent({
                        type: "click",
                        mouseEvent: a
                    });
                else {
                    this.panorama.dispatchEvent({
                        type: "hover",
                        intersects: c,
                        mouseEvent: a
                    });
                    if (this.hoverObject && 0 < c.length && this.hoverObject !== d || this.hoverObject && 0 === c.length)
                        this.hoverObject.dispatchEvent && (this.hoverObject.dispatchEvent({
                            type: "hoverleave",
                            mouseEvent: a
                        }),
                        this.reticle.end()),
                        this.hoverObject = void 0;
                    d && 0 < c.length && (this.hoverObject !== d && (this.hoverObject = d,
                    this.hoverObject.dispatchEvent && (this.hoverObject.dispatchEvent({
                        type: "hoverenter",
                        mouseEvent: a
                    }),
                    (this.options.autoReticleSelect && this.options.enableReticle || this.tempEnableReticle) && this.reticle.start(this.onTap.bind(this, a, "click")))),
                    "mousedown" === this.userMouse.type && this.pressEntityObject != d && (this.pressEntityObject = d,
                    this.pressEntityObject.dispatchEvent && this.pressEntityObject.dispatchEvent({
                        type: "pressstart-entity",
                        mouseEvent: a
                    })),
                    "mousedown" === this.userMouse.type && this.pressObject != g && (this.pressObject = g,
                    this.pressObject.dispatchEvent && this.pressObject.dispatchEvent({
                        type: "pressstart",
                        mouseEvent: a
                    })),
                    "mousemove" === this.userMouse.type || this.options.enableReticle) && (g && g.dispatchEvent && g.dispatchEvent({
                        type: "hover",
                        mouseEvent: a
                    }),
                    this.pressEntityObject && this.pressEntityObject.dispatchEvent && this.pressEntityObject.dispatchEvent({
                        type: "pressmove-entity",
                        mouseEvent: a
                    }),
                    this.pressObject && this.pressObject.dispatchEvent && this.pressObject.dispatchEvent({
                        type: "pressmove",
                        mouseEvent: a
                    }));
                    !d && this.pressEntityObject && this.pressEntityObject.dispatchEvent && (this.pressEntityObject.dispatchEvent({
                        type: "pressstop-entity",
                        mouseEvent: a
                    }),
                    this.pressEntityObject = void 0);
                    !g && this.pressObject && this.pressObject.dispatchEvent && (this.pressObject.dispatchEvent({
                        type: "pressstop",
                        mouseEvent: a
                    }),
                    this.pressObject = void 0)
                }
                if (g && g instanceof y) {
                    if (this.infospot = g,
                    "click" === b)
                        return !0
                } else
                    this.infospot && this.hideInfospot();
                this.options.autoRotate && "mousemove" !== this.userMouse.type && (clearTimeout(this.autoRotateRequestId),
                this.control === this.OrbitControls && (this.OrbitControls.autoRotate = !1,
                this.autoRotateRequestId = window.setTimeout(this.enableAutoRate.bind(this), this.options.autoRotateActivationDuration)))
            }
        },
        getConvertedIntersect: function(a) {
            for (var b, c = 0; c < a.length; c++)
                if (0 <= a[c].distance && a[c].object && !a[c].object.passThrough && (!a[c].object.entity || !a[c].object.entity.passThrough)) {
                    b = a[c].object.entity && !a[c].object.entity.passThrough ? a[c].object.entity : a[c].object;
                    break
                }
            return b
        },
        hideInfospot: function() {
            this.infospot && (this.infospot.onHoverEnd(),
            this.infospot = void 0)
        },
        toggleControlBar: function() {
            var a = this.widget;
            a && a.dispatchEvent({
                type: "control-bar-toggle"
            })
        },
        onKeyDown: function(a) {
            this.options.output && "none" !== this.options.output && "Control" === a.key && (this.outputEnabled = !0)
        },
        onKeyUp: function() {
            this.outputEnabled = !1
        },
        update: function() {
            m.update();
            this.updateCallbacks.forEach(function(a) {
                a()
            });
            this.control.update();
            this.scene.traverse(function(a) {
                if (a instanceof y && a.element && (this.hoverObject === a || "none" !== a.element.style.display || a.element.left && "none" !== a.element.left.style.display || a.element.right && "none" !== a.element.right.style.display))
                    if (this.checkSpriteInViewport(a)) {
                        var b = this.getScreenVector(a.getWorldPosition(new d.Vector3));
                        a.translateElement(b.x, b.y)
                    } else
                        a.onDismiss()
            }
            .bind(this))
        },
        render: function() {
            this.mode === q.CARDBOARD || this.mode === q.STEREO ? (this.renderer.clear(),
            this.effect.render(this.scene, this.camera, this.panorama),
            this.effect.render(this.sceneReticle, this.camera)) : (this.renderer.clear(),
            this.renderer.render(this.scene, this.camera),
            this.renderer.clearDepth(),
            this.renderer.render(this.sceneReticle, this.camera))
        },
        animate: function() {
            this.requestAnimationId = window.requestAnimationFrame(this.animate.bind(this));
            this.onChange()
        },
        onChange: function() {
            this.update();
            this.render()
        },
        registerMouseAndTouchEvents: function() {
            var a = {
                passive: !1
            };
            this.container.addEventListener("mousedown", this.handlerMouseDown, a);
            this.container.addEventListener("mousemove", this.handlerMouseMove, a);
            this.container.addEventListener("mouseup", this.handlerMouseUp, a);
            this.container.addEventListener("touchstart", this.handlerMouseDown, a);
            this.container.addEventListener("touchend", this.handlerMouseUp, a)
        },
        unregisterMouseAndTouchEvents: function() {
            this.container.removeEventListener("mousedown", this.handlerMouseDown, !1);
            this.container.removeEventListener("mousemove", this.handlerMouseMove, !1);
            this.container.removeEventListener("mouseup", this.handlerMouseUp, !1);
            this.container.removeEventListener("touchstart", this.handlerMouseDown, !1);
            this.container.removeEventListener("touchend", this.handlerMouseUp, !1)
        },
        registerReticleEvent: function() {
            this.addUpdateCallback(this.handlerTap)
        },
        unregisterReticleEvent: function() {
            this.removeUpdateCallback(this.handlerTap)
        },
        updateReticleEvent: function() {
            var a = this.container.clientWidth / 2 + this.container.offsetLeft
              , b = this.container.clientHeight / 2;
            this.removeUpdateCallback(this.handlerTap);
            this.handlerTap = this.onTap.bind(this, {
                clientX: a,
                clientY: b
            });
            this.addUpdateCallback(this.handlerTap)
        },
        registerEventListeners: function() {
            window.addEventListener("resize", this.handlerWindowResize, !0);
            window.addEventListener("keydown", this.handlerKeyDown, !0);
            window.addEventListener("keyup", this.handlerKeyUp, !0)
        },
        unregisterEventListeners: function() {
            window.removeEventListener("resize", this.handlerWindowResize, !0);
            window.removeEventListener("keydown", this.handlerKeyDown, !0);
            window.removeEventListener("keyup", this.handlerKeyUp, !0)
        },
        dispose: function() {
            function a(b) {
                for (var c = b.children.length - 1; 0 <= c; c--)
                    a(b.children[c]),
                    b.remove(b.children[c]);
                b instanceof r || b instanceof y ? b.dispose() : b.dispatchEvent && b.dispatchEvent("dispose")
            }
            this.disableAutoRate();
            this.tweenLeftAnimation.stop();
            this.tweenUpAnimation.stop();
            this.unregisterEventListeners();
            a(this.scene);
            this.widget && (this.widget.dispose(),
            this.widget = null);
            d.Cache && d.Cache.enabled && d.Cache.clear()
        },
        destroy: function() {
            this.dispose();
            this.render();
            window.cancelAnimationFrame(this.requestAnimationId)
        },
        onPanoramaDispose: function(a) {
            a instanceof z && this.hideVideoWidget();
            a === this.panorama && (this.panorama = null)
        },
        loadAsyncRequest: function(a, b) {
            b = void 0 === b ? function() {}
            : b;
            var c = new window.XMLHttpRequest;
            c.onloadend = function(a) {
                b(a)
            }
            ;
            c.open("GET", a, !0);
            c.send(null)
        },
        addViewIndicator: function() {
            var a = this;
            this.loadAsyncRequest(t.ViewIndicator, function(b) {
                if (0 !== b.loaded) {
                    b = b.target.responseXML.documentElement;
                    b.style.width = a.viewIndicatorSize + "px";
                    b.style.height = a.viewIndicatorSize + "px";
                    b.style.position = "absolute";
                    b.style.top = "10px";
                    b.style.left = "10px";
                    b.style.opacity = "0.5";
                    b.style.cursor = "pointer";
                    b.id = "panolens-view-indicator-container";
                    a.container.appendChild(b);
                    var c = b.querySelector("#indicator");
                    a.addUpdateCallback(function() {
                        a.radius = .225 * a.viewIndicatorSize;
                        a.currentPanoAngle = a.camera.rotation.y - d.Math.degToRad(90);
                        a.fovAngle = d.Math.degToRad(a.camera.fov);
                        a.leftAngle = -a.currentPanoAngle - a.fovAngle / 2;
                        a.rightAngle = -a.currentPanoAngle + a.fovAngle / 2;
                        a.leftX = a.radius * Math.cos(a.leftAngle);
                        a.leftY = a.radius * Math.sin(a.leftAngle);
                        a.rightX = a.radius * Math.cos(a.rightAngle);
                        a.rightY = a.radius * Math.sin(a.rightAngle);
                        a.indicatorD = "M " + a.leftX + " " + a.leftY + " A " + a.radius + " " + a.radius + " 0 0 1 " + a.rightX + " " + a.rightY;
                        a.leftX && a.leftY && a.rightX && a.rightY && a.radius && c.setAttribute("d", a.indicatorD)
                    });
                    b.addEventListener("mouseenter", function() {
                        this.style.opacity = "1"
                    });
                    b.addEventListener("mouseleave", function() {
                        this.style.opacity = "0.5"
                    })
                }
            })
        },
        appendControlItem: function(a) {
            var b = this.widget.createCustomItem(a);
            "video" === a.group ? this.widget.videoElement.appendChild(b) : this.widget.barElement.appendChild(b);
            return b
        },
        clearAllCache: function() {
            d.Cache.clear()
        }
    });
    "105" != d.REVISION && console.warn("three.js version is not matched. Please consider use the target revision 105");
    window.TWEEN = m;
    k.BasicPanorama = S;
    k.CONTROLS = E;
    k.CameraPanorama = T;
    k.CubePanorama = M;
    k.CubeTextureLoader = ha;
    k.DataImage = t;
    k.EmptyPanorama = R;
    k.GoogleStreetviewPanorama = aa;
    k.ImageLittlePlanet = ba;
    k.ImageLoader = fa;
    k.ImagePanorama = u;
    k.Infospot = y;
    k.LittlePlanet = B;
    k.MODES = q;
    k.Media = Y;
    k.Panorama = r;
    k.REVISION = "11";
    k.Reticle = J;
    k.STEREOFORMAT = C;
    k.Stereo = F;
    k.StereoImagePanorama = N;
    k.StereoVideoPanorama = G;
    k.THREE_REVISION = "105";
    k.THREE_VERSION = ja;
    k.TextureLoader = K;
    k.VERSION = "0.11.0";
    k.VideoPanorama = z;
    k.Viewer = ea;
    k.Widget = L;
    Object.defineProperty(k, "__esModule", {
        value: !0
    })
});
