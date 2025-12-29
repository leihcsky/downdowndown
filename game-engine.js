import { PlatformStyles } from './platform-styles.js';

/**
 * DownDownDown Game Engine
 * Date: 2025-12-23
 */

// ============================================================================
// 1. EVENT SYSTEM - 事件总线系统
// ============================================================================

class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);
  }

  off(eventName, callback) {
    if (!this.listeners.has(eventName)) return;
    const callbacks = this.listeners.get(eventName);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(eventName, data) {
    if (!this.listeners.has(eventName)) return;
    this.listeners.get(eventName).forEach(callback => callback(data));
  }

  clear() {
    this.listeners.clear();
  }
}

// ============================================================================
// 2. GAME CONSTANTS - 游戏常量
// ============================================================================

const GAME_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 320,
  CANVAS_HEIGHT: 420, // Reduced from 459 to 420 (excluding top bar height 39px) to prevent vertical stretching
  CANVAS_PADDING: 10, // M = 10
  
  // Player config
  PLAYER_WIDTH: 32, // J = 32
  PLAYER_HEIGHT: 32, // J = 32
  PLAYER_SPRITE_OFFSET: 0,
  PLAYER_MAX_HP: 10,
  PLAYER_HURT_DURATION: 1000,
  PLAYER_DEATH_DURATION: 1000,
  PLAYER_HURT_RECOVERY: 2000, // Time without damage before healing starts (Nt = 2000)
  PLAYER_HEAL_INTERVAL: 1000, // Time between heals (Ot = 1000)
  
  // Platform config
  PLATFORM_WIDTH: 100, // p = 100
  PLATFORM_HEIGHT: 12, // S = 12
  PLATFORM_SPACING: 60, // ke = 60
  PLATFORM_SPEED_BASE: 0.1, // xe = -0.1 px/ms (inverted to positive for calculation)
  PLATFORM_SPEED_INCREMENT: 0, // Not used in downgame.js? Uses speed_boost
  PLATFORM_CHANGE_INTERVAL: 300,
  
  // Physics
  GRAVITY: 0.0015, // Ke = 0.0015 px/ms^2 (15e-4)
  GRAVITY_INCREASE: 0,
  MAX_VELOCITY: 1.0, 
  PLAYER_SPEED: 0.2, // $t = 0.2 px/ms
  CONVEYOR_SPEED: 0.1, // Mt = 0.1 px/ms
  
  // Timing
  FAKE_PLATFORM_DELAY: 100, // ue = 100
  FAKE_PLATFORM_DISAPPEAR_TIME: 300, // Y = 300
  
  // Spring
  SPRING_VELOCITY: -0.5, // Gt = -0.5 (Synced with downgame.js)
  SPRING_HEIGHT: 8, // G = S - 4 = 12 - 4 = 8
  
  // Spike damage
  SPIKE_DAMAGE: 4, // hurt(4, n) in Je class
  CEILING_DAMAGE: 5, // Ceiling spikes are deadlier
  
  // UI Offset
  TOP_UI_OFFSET: 39, // Offset for top status bar to prevent hiding spikes
  
  // Debug
  FORCE_DEBUG_PLAYER: false,
    
    // Animation frames
  FPS: 50,
  FRAME_TIME: 20,
  
  // Level Config (Synced with downgame.js)
  DEFAULT_LEVEL_CONFIG: [
    {
      level_threshold: 20,
      floor_chances: [10, 3, 1, 1, 1, 2], // [regular, fake, spike, conveyorLeft, conveyorRight, spring]
      speed_boost: 1.01
    },
    {
      level_threshold: 40,
      floor_chances: [7, 3, 1, 1, 1, 2],
      speed_boost: 1.04
    },
    {
      level_threshold: 60,
      floor_chances: [5, 4, 2, 2, 2, 3],
      speed_boost: 1.08
    },
    {
      level_threshold: 80,
      floor_chances: [3, 5, 3, 3, 3, 3],
      speed_boost: 1.12
    }
  ]
};

const GAME_STATES = {
  INITIAL: 'initial',
  READY: 'ready',
  RUNNING: 'running',
  PAUSED: 'paused',
  COOLDOWN: 'cooldown',
  GAMEOVER: 'gameover'
};

const PLATFORM_TYPES = {
  NORMAL: 0,
  SPRING: 1,
  CONVEYOR: 2,
  SPIKE: 3,
  FAKE: 4
};

const DIRECTIONS = {
  LEFT: 'left',
  RIGHT: 'right'
};

// ============================================================================
// 3. RESOURCE LOADER - 资源加载器
// ============================================================================

class RenderCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get a cached canvas or create one if it doesn't exist.
   * @param {string} key Unique key for the cache entry
   * @param {number} width Width of the object
   * @param {number} height Height of the object
   * @param {Function} drawFn Function to draw the object on the cached canvas (ctx, w, h)
   * @returns {Object} { canvas, anchorX, anchorY }
   */
  get(key, width, height, drawFn) {
    if (!this.cache.has(key)) {
      const padding = 20; 
      const canvasWidth = width + padding * 2;
      const canvasHeight = height + 60; 
      
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      
      // Anchor point: (padding, canvasHeight - padding)
      // This corresponds to (0, 0) in the object's local space (usually bottom-left)
      const anchorX = padding;
      const anchorY = canvasHeight - padding;
      
      ctx.save();
      ctx.translate(anchorX, anchorY);
      drawFn(ctx, width, height);
      ctx.restore();
      
      this.cache.set(key, { 
        canvas, 
        anchorX, 
        anchorY 
      });
    }
    
    return this.cache.get(key);
  }
  
  clear() {
    this.cache.clear();
  }
}

class ResourceLoader {
  constructor(basePath = './') {
    this.basePath = basePath;
    this.images = new Map();
    this.sounds = new Map();
    this.loaded = {
      images: 0,
      sounds: 0
    };
    this.total = {
      images: 0,
      sounds: 0
    };
  }

  async loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // Important for Canvas getImageData and safe rendering from CDN
      img.crossOrigin = 'anonymous'; 
      img.onload = () => {
        this.images.set(key, img);
        this.loaded.images++;
        resolve(img);
      };
      img.onerror = (e) => {
        console.error(`Failed to load image: ${src}`, e);
        // Resolve with null instead of rejecting to allow game to continue with fallbacks
        resolve(null); 
      };
      img.src = this.basePath + src;
    });
  }

  async loadSound(key, src) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.sounds.set(key, audio);
        this.loaded.sounds++;
        resolve(audio);
      };
      audio.onerror = reject;
      audio.src = this.basePath + src;
      audio.crossOrigin = 'anonymous';
    });
  }

  async loadAllResources() {
    const imagesToLoad = [
      ['hero', 'images/hero.png'],
      ['background', 'images/bg.png']
    ];

    const soundsToLoad = [
      ['normal', 'sounds/normal.mp3'],
      ['hurt', 'sounds/hurt.mp3'],
      ['dead', 'sounds/dead.mp3'],
      ['spring', 'sounds/spring.mp3'],
      ['roll', 'sounds/roll.mp3'],
      ['lr', 'sounds/lr.mp3']
    ];
    this.total.images = imagesToLoad.length;
    this.total.sounds = soundsToLoad.length;

    try {
      const imagePromises = imagesToLoad.map(([key, src]) => this.loadImage(key, src));
      const soundPromises = soundsToLoad.map(([key, src]) => this.loadSound(key, src));
      
      // Use allSettled to allow partial loading (e.g. if sounds are missing)
      const results = await Promise.allSettled([...imagePromises, ...soundPromises]);
      
      // Log failures
      results.forEach((result, index) => {
          if (result.status === 'rejected') {
              const isImage = index < imagesToLoad.length;
              const info = isImage ? imagesToLoad[index] : soundsToLoad[index - imagesToLoad.length];
              console.warn(`Failed to load ${isImage ? 'image' : 'sound'}: ${info[0]} (${info[1]})`, result.reason);
          }
      });
      
      // Verify hero image specifically
      if (this.images.has('hero')) {
          const heroImg = this.images.get('hero');
          console.log('Hero image loaded:', heroImg.width, 'x', heroImg.height, heroImg.src);
      } else {
          console.error('Hero image failed to load!');
      }
      
      console.log('All resources loaded:', Array.from(this.images.keys()));
      return true;
    } catch (error) {
      console.error('Resource loading failed:', error);
      return false;
    }
  }

  getImage(key) {
    return this.images.get(key);
  }

  getSound(key) {
    return this.sounds.get(key);
  }

  playSound(key) {
    const audio = this.getSound(key);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }

  getProgress() {
    const total = this.total.images + this.total.sounds;
    const loaded = this.loaded.images + this.loaded.sounds;
    return total > 0 ? (loaded / total) * 100 : 0;
  }
}

// ============================================================================
// 4. PLAYER CLASS - 玩家类
// ============================================================================

class Player {
  constructor(config, resources) {
    this.config = config;
    this.resources = resources;
    
    // Position and movement
    this.x = config.CANVAS_WIDTH / 2 - config.PLAYER_WIDTH / 2;
    // Start near bottom like downgame.js (L - ke = 420 - 60 = 360)
    // Matches reset() logic
    // START SLIGHTLY HIGHER to ensure we fall ONTO the platform, not inside it
    this.y = config.CANVAS_HEIGHT - config.PLATFORM_SPACING - 20;
    this.width = config.PLAYER_WIDTH;
    this.height = config.PLAYER_HEIGHT;
    this.velocityY = 0;
    
    // State
    this.hp = config.PLAYER_MAX_HP;
    this.isHurt = false;
    this.hurtTime = 0;
    this.lastHealTime = 0;
    this.isDead = false;
    this.deathTime = 0;
    
    // Movement
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.facingDirection = DIRECTIONS.RIGHT;
    
    // Animation
    this.animationFrame = 0;
    this.animationTime = 0;
    this.animationSpeed = 100; // ms per frame
    
    // Sprite animation states (Single row sprite sheet, 32px width)
    this.spriteStates = {
      standing: { frames: [0] },
      walking: { frames: [1, 2, 3] },
      falling: { frames: [4, 5, 6] },
      hurt: { frames: [4, 5, 6] }
    };
    this.currentState = 'falling';
    this.onGround = false;
    this.currentPlatform = null;
  }

  reset() {
    this.x = this.config.CANVAS_WIDTH / 2 - this.config.PLAYER_WIDTH / 2;
    // Start near bottom like downgame.js (L - ke = 420 - 60 = 360)
    // In downgame.js, player.y is the bottom (feet) position.
    // Platform.y is also the surface position.
    // So player starts exactly at platform level.
    // START SLIGHTLY HIGHER to ensure collision detection catches it
    this.y = this.config.CANVAS_HEIGHT - this.config.PLATFORM_SPACING - 20; 
    this.velocityY = 0;
    this.vx = 0;
    this.hp = this.config.PLAYER_MAX_HP;
    this.isHurt = false;
    this.hurtTime = 0;
    this.lastHealTime = 0;
    this.isDead = false;
    this.deathTime = 0;
    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.animationFrame = 0;
    this.currentState = 'falling';
    this.onGround = false;
    this.currentPlatform = null;
    this.hasLogged = false;
    this.hasLoggedFallback = false;
  }

  setGrounded(grounded, platform = null) {
    this.onGround = grounded;
    this.currentPlatform = platform;
  }


  takeDamage(amount, currentTime) {
    if (this.isHurt || this.isDead) return;
    
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
      this.deathTime = currentTime || Date.now();
      return 'dead';
    } else {
      this.isHurt = true;
      this.hurtTime = currentTime || Date.now();
      return 'hurt';
    }
  }

  checkHealing(currentTime) {
    if (this.hp < this.config.PLAYER_MAX_HP) {
      if (currentTime - this.hurtTime >= this.config.PLAYER_HURT_RECOVERY && 
          currentTime - this.lastHealTime >= this.config.PLAYER_HEAL_INTERVAL) {
        this.hp++;
        this.lastHealTime = currentTime;
        this.resources.playSound('healed'); // Assuming sound exists or is handled
        // Downgame.js emits 'heroHealed'
      }
    }
  }

  update(deltaTime, currentTime) {
    if (this.isDead) {
      this.vx = 0; // Stop conveyor movement
      return; // Stop player movement
    }

    // Update hurt state
    if (this.isHurt && currentTime - this.hurtTime > this.config.PLAYER_HURT_DURATION) {
      this.isHurt = false;
    }
    
    // Check healing
    this.checkHealing(currentTime);

    // Base speed from config (0.2 px/ms)
    const moveSpeed = this.config.PLAYER_SPEED * deltaTime;
    
    // Apply conveyor velocity (vx) if any
    if (this.vx !== 0) {
      this.x += this.vx * deltaTime;
    }
    
    if (this.isMovingLeft) {
      this.x -= moveSpeed;
      this.facingDirection = DIRECTIONS.LEFT;
      if (this.x < this.config.CANVAS_PADDING) {
        this.x = this.config.CANVAS_PADDING;
      }
    }
    if (this.isMovingRight) {
      this.x += moveSpeed;
      this.facingDirection = DIRECTIONS.RIGHT;
      if (this.x > this.config.CANVAS_WIDTH - this.config.CANVAS_PADDING - this.config.PLAYER_WIDTH) {
        this.x = this.config.CANVAS_WIDTH - this.config.CANVAS_PADDING - this.config.PLAYER_WIDTH;
      }
    }
    
    // Update animation state
    if (this.isDead || this.isHurt) {
      this.currentState = 'hurt';
    } else if (this.isMovingLeft || this.isMovingRight) {
      this.currentState = 'walking';
    } else if (this.onGround) {
      this.currentState = 'standing';
    } else {
      this.currentState = 'falling';
    }
    
    // Update animation frame
    this.animationTime += deltaTime;
    if (this.animationTime > this.animationSpeed) {
      this.animationTime = 0;
      const state = this.spriteStates[this.currentState];
      this.animationFrame = (this.animationFrame + 1) % state.frames.length;
    }
  }

  getHitbox() {
    return {
      x: this.x,
      // Hitbox is based on player position (bottom)
      // So box is from y-height to y
      y: this.y - this.config.PLAYER_HEIGHT,
      width: this.config.PLAYER_WIDTH,
      height: this.config.PLAYER_HEIGHT
    };
  }

  draw(ctx, currentTime) {
    const time = currentTime || Date.now();
    const heroImage = this.resources.getImage('hero');
    
    // Log once for debugging
    if (!this.hasLogged) {
        this.hasLogged = true;
        if (heroImage) {
             console.log(`[Player] First Draw: pos(${this.x}, ${this.y}), src: ${heroImage.src}, loaded: ${heroImage.complete}, w/h: ${heroImage.naturalWidth}x${heroImage.naturalHeight}`);
        } else {
             console.error(`[Player] First Draw: Hero image missing! Resources loaded: ${this.resources.loaded.images}/${this.resources.total.images}`);
        }
    }
    
    ctx.save();
    
    // Check if image is valid for drawing
    // If width is 0, it's not ready.
    if (!heroImage || !heroImage.complete || heroImage.naturalWidth === 0) {
      // Fallback: draw a simple colored square
      // Always log this warning once
      if (!this.hasLoggedFallback) {
          console.warn('[Player] Hero image not ready, drawing fallback at', this.x, this.y, 'Visible:', this.y < this.config.CANVAS_HEIGHT && this.y > 0);
          this.hasLoggedFallback = true;
      }
      
      ctx.fillStyle = this.isHurt || this.isDead ? '#ff0000' : '#FF00FF'; // Magenta for high visibility
      // Draw from bottom-left (y) upwards
      ctx.fillRect(this.x, this.y - this.config.PLAYER_HEIGHT, this.config.PLAYER_WIDTH, this.config.PLAYER_HEIGHT);
      
      // Force stroke to make it even more visible
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y - this.config.PLAYER_HEIGHT, this.config.PLAYER_WIDTH, this.config.PLAYER_HEIGHT);
      
      ctx.restore();
      return;
    }
    
    // Create offscreen canvas for tinting if not exists
    if (!this.tintCanvas) {
      this.tintCanvas = document.createElement('canvas');
      this.tintCanvas.width = this.config.PLAYER_WIDTH;
      this.tintCanvas.height = this.config.PLAYER_HEIGHT;
      this.tintCtx = this.tintCanvas.getContext('2d', { willReadFrequently: true });
    }

    const state = this.spriteStates[this.currentState];
    const spriteWidth = 32;
    const spriteHeight = 32;
    
    // Get frame index from state configuration
    let frameIndex = state.frames[this.animationFrame % state.frames.length] || 0;
    
    // SAFETY CHECK: Ensure we don't read past the image width
    const maxFrames = Math.floor(heroImage.naturalWidth / spriteWidth);
    if (maxFrames > 0) {
        frameIndex = frameIndex % maxFrames;
    } else {
        frameIndex = 0; // Should not happen if width > 0
    }

    const sx = frameIndex * spriteWidth;
    const sy = 0; // Single row sprite sheet
    
    // Check hurt status for visual effects
    const isHurtRecently = this.isHurt && (time - this.hurtTime < 1000);
    
    // If hurt, handle blinking
    if (isHurtRecently) {
      const blinkSpeed = 100;
      // We use a property to track blink state to match original logic
      if (!this.blinkTime || time - this.blinkTime >= blinkSpeed) {
         this.blinkTime = time;
         this.blinkState = !this.blinkState;
      }
    } else {
      this.blinkState = false;
    }

    // Prepare drawing context
    ctx.save();

    // Flip horizontally if facing left
    if (this.facingDirection === DIRECTIONS.LEFT) {
      ctx.translate(this.x + this.config.PLAYER_WIDTH, this.y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(this.x, this.y);
    }

    // Destination coordinates (relative to translated origin)
    const dx = 0;
    const dy = -this.config.PLAYER_HEIGHT;

    // Draw logic
    if (isHurtRecently) {
       // Draw RED tint effect when hurt
       // 1. Clear tint canvas
       this.tintCtx.clearRect(0, 0, this.config.PLAYER_WIDTH, this.config.PLAYER_HEIGHT);
       this.tintCtx.imageSmoothingEnabled = false;
       
       // 2. Draw sprite frame to tint canvas
       this.tintCtx.drawImage(
         heroImage,
         sx, sy, spriteWidth, spriteHeight,
         0, 0, this.config.PLAYER_WIDTH, this.config.PLAYER_HEIGHT
       );
       
       // 3. Apply red tint using composite operation (Safe for CORS)
       // Use source-atop to draw red overlay only on non-transparent pixels
       this.tintCtx.globalCompositeOperation = 'source-atop';
       this.tintCtx.fillStyle = this.blinkState ? 'rgba(255, 0, 0, 0.6)' : 'rgba(255, 0, 0, 0.4)';
       this.tintCtx.fillRect(0, 0, this.config.PLAYER_WIDTH, this.config.PLAYER_HEIGHT);
       
       // Reset composite operation
       this.tintCtx.globalCompositeOperation = 'source-over';
       
       // 4. Draw tinted canvas to main context
       ctx.drawImage(
         this.tintCanvas,
         0, 0, this.config.PLAYER_WIDTH, this.config.PLAYER_HEIGHT,
         dx, dy, this.config.PLAYER_WIDTH, this.config.PLAYER_HEIGHT
       );
       
    } else {
       // Normal Draw
       ctx.drawImage(
        heroImage,
        sx, sy, spriteWidth, spriteHeight,
        dx, dy,
        this.config.PLAYER_WIDTH, this.config.PLAYER_HEIGHT // 32x32 destination
      );
    }
    
    ctx.restore();

    // Draw hitbox (debug) - Draw LAST to ensure visibility over sprite
    if (window.DEBUG_PLAYER || window.FORCE_DEBUG_PLAYER || this.config.FORCE_DEBUG_PLAYER) {
      ctx.save(); // New save for debug drawing which shouldn't be affected by player scale/translate
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00ff00';
      // Draw relative to current transform (which is at player x,y)
      // Sprite is drawn at (dx, dy) which is (0, -height)
      // So debug rect should also be at (dx, dy)
      // Note: We need to manually translate here because we popped the previous context
      ctx.strokeRect(this.x, this.y - this.config.PLAYER_HEIGHT, this.config.PLAYER_WIDTH, this.config.PLAYER_HEIGHT);
      ctx.restore();
    }
  }
}

// ============================================================================
// 5. PLATFORM CLASSES - 平台类系统
// ============================================================================

class Platform {
  constructor(x, y, type, config, direction = null) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.config = config;
    this.width = config.PLATFORM_WIDTH;
    this.height = config.PLATFORM_HEIGHT;
    this.direction = direction;
    this.sequenceNumber = 0;
    this.touched = false;
    this.touchTime = 0;
    this.visible = true;
    
    // Animation properties
    this.animationOffset = 0;
    this.animationCounter = 0;
    this.highlightIndex = 0;
  }

  update(deltaTime, currentTime) {
    // Override in subclasses
  }

  // Called every frame when player is standing on this platform
  onStanding(player, currentTime) {
    // Override in subclasses
  }

  // Called when player leaves this platform
  onLeave(player, currentTime) {
    // Override in subclasses
  }

  checkCollision(player) {
    const playerBox = player.getHitbox();
    const platformSurfaceY = this.y - this.height;
    
    // Check if player is falling onto platform from above
    if (player.velocityY >= 0) {
      // Horizontal overlap check
      const isHorizontallyOverlapping = 
        playerBox.x + playerBox.width > this.x &&
        playerBox.x < this.x + this.width;
        
      if (isHorizontallyOverlapping) {
        // Vertical check: player's feet (player.y) should be close to platform surface (this.y - height)
        const diff = player.y - platformSurfaceY;
        
        // Simplified check:
        if (diff >= -5 && diff <= 10 + player.velocityY) {
            return true;
        }
      }
    }
    
    return false;
  }

  onCollision(player, currentTime) {
    const isFirstTouch = !this.touched;
    if (isFirstTouch) {
        this.touched = true;
        this.touchTime = currentTime || Date.now();
    }
    
    const result = this.handleCollision(player, currentTime);
    
    // If not first touch, suppress sound to avoid spamming
    if (!isFirstTouch) {
        result.sound = null;
    }
    
    return result;
  }

  handleCollision(player, currentTime) {
    // Override in subclasses
    return { type: 'normal', damage: 0 };
  }

  draw(ctx, platformStyles, renderCache, currentTime) {
    // Use platform styles from platform-styles.js
    if (platformStyles) {
      try {
        currentTime = currentTime || Date.now();
        switch (this.type) {
          case PLATFORM_TYPES.NORMAL:
            if (renderCache) {
              const cached = renderCache.get(`normal_${this.width}_${this.height}`, this.width, this.height, (ctx, w, h) => {
                platformStyles.drawNormalPlatform(ctx, 0, 0, w, h);
              });
              ctx.drawImage(cached.canvas, this.x - cached.anchorX, this.y - cached.anchorY);
            } else {
              platformStyles.drawNormalPlatform(ctx, this.x, this.y, this.width, this.height);
            }
            break;
            
          case PLATFORM_TYPES.SPRING:
            // Use current spring height (this.springHeight) if available
            const springHeight = (this instanceof SpringPlatform) ? this.springHeight : (this.config.SPRING_HEIGHT || 8);
            const defaultSpringHeight = this.config.SPRING_HEIGHT || 8;
            
            if (renderCache && springHeight === defaultSpringHeight) {
               // Only cache if static
               const cached = renderCache.get(`spring_${this.width}_${defaultSpringHeight}`, this.width, this.height, (ctx, w, h) => {
                platformStyles.drawSpringPlatform(ctx, 0, 0, w, h, defaultSpringHeight, 0);
              });
              ctx.drawImage(cached.canvas, this.x - cached.anchorX, this.y - cached.anchorY);
            } else {
              platformStyles.drawSpringPlatform(ctx, this.x, this.y, this.width, this.height, springHeight, currentTime);
            }
            break;
            
          case PLATFORM_TYPES.CONVEYOR:
            if (renderCache) {
              // Cache based on animation state
              const key = `conveyor_${this.width}_${this.height}_${this.direction}_${this.animationOffset}_${this.highlightIndex}`;
              const cached = renderCache.get(key, this.width, this.height, (ctx, w, h) => {
                platformStyles.drawConveyorPlatform(
                  ctx, 0, 0, w, h,
                  this.direction, this.animationOffset, this.highlightIndex
                );
              });
              ctx.drawImage(cached.canvas, this.x - cached.anchorX, this.y - cached.anchorY);
            } else {
              platformStyles.drawConveyorPlatform(
                ctx, this.x, this.y, this.width, this.height,
                this.direction, this.animationOffset, this.highlightIndex
              );
            }
            break;
            
          case PLATFORM_TYPES.SPIKE:
            if (renderCache) {
              // Cache static geometry
              const cached = renderCache.get(`spike_${this.width}_${this.height}`, this.width, this.height, (ctx, w, h) => {
                platformStyles.drawSpikePlatform(ctx, 0, 0, w, h, 0);
              });
              ctx.drawImage(cached.canvas, this.x - cached.anchorX, this.y - cached.anchorY);
              
              // Draw dynamic pulse effect overlay
              if (Math.sin(currentTime * 0.003) > 0.7) {
                const spikeHeight = 12;
                ctx.save();
                ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
                ctx.translate(this.x, this.y);
                ctx.fillRect(0, -this.height - spikeHeight, this.width, this.height + spikeHeight);
                ctx.restore();
              }
            } else {
              platformStyles.drawSpikePlatform(ctx, this.x, this.y, this.width, this.height, currentTime);
            }
            break;
            
          case PLATFORM_TYPES.FAKE:
            const fakePlatform = this;
            const fullHeight = this.config.PLATFORM_HEIGHT; // Use config height as full height
            const currentHeight = (this instanceof FakePlatform) ? fakePlatform.currentHeight : (fakePlatform.disappearing ? fullHeight * fakePlatform.opacity : fullHeight);
            
            // Only cache if fully visible (not disappearing)
            if (renderCache && currentHeight >= fullHeight - 0.1) {
              const cached = renderCache.get(`fake_${this.width}_${fullHeight}`, this.width, fullHeight, (ctx, w, h) => {
                platformStyles.drawFakePlatform(ctx, 0, 0, w, h, h, 0);
              });
              ctx.drawImage(cached.canvas, this.x - cached.anchorX, this.y - cached.anchorY);
              
              // Draw dynamic scanline overlay
              if (Math.sin(currentTime * 0.005) > 0.6) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.fillStyle = 'rgba(196, 181, 253, 0.4)';
                ctx.fillRect(0, -fullHeight, this.width, 2);
                ctx.restore();
              }
            } else {
              platformStyles.drawFakePlatform(
                ctx, this.x, this.y, this.width, fullHeight,
                currentHeight, currentTime
              );
            }
            break;
            
          default:
            this.drawFallback(ctx);
        }
      } catch (error) {
        console.warn('Platform style error, using fallback:', error);
        this.drawFallback(ctx);
      }
    } else {
      // Fallback drawing
      this.drawFallback(ctx);
    }
  }

  drawFallback(ctx) {
    ctx.fillStyle = this.getColor();
    const drawY = this.y - this.height;
    ctx.fillRect(this.x, drawY, this.width, this.height);
  }

  getColor() {
    switch (this.type) {
      case PLATFORM_TYPES.NORMAL: return '#60a5fa';
      case PLATFORM_TYPES.SPRING: return '#4ade80';
      case PLATFORM_TYPES.CONVEYOR: return '#a78bfa';
      case PLATFORM_TYPES.SPIKE: return '#ef4444';
      case PLATFORM_TYPES.FAKE: return 'rgba(156, 163, 175, 0.5)';
      default: return '#ffffff';
    }
  }
}

class NormalPlatform extends Platform {
  constructor(x, y, config) {
    super(x, y, PLATFORM_TYPES.NORMAL, config);
  }

  handleCollision(player, currentTime) {
    return { type: 'normal', damage: 0, sound: 'normal' };
  }
}

class SpringPlatform extends Platform {
  constructor(x, y, config) {
    super(x, y, PLATFORM_TYPES.SPRING, config);
    // G = 8 (downgame.js value)
    this.springHeight = this.config.SPRING_HEIGHT || 8;
    this.restoring = false;
    this.touchTime = 0;
    this.leavingTime = 0;
    this.height = this.springHeight + 4;
  }

  handleCollision(player) {
    return { type: 'spring', damage: 0, sound: 'spring' };
  }

  onStanding(player, currentTime) {
    if (this.touchTime === 0) this.touchTime = currentTime;
    
    const n = currentTime - this.touchTime;
    const se = 100;
    const G = this.config.SPRING_HEIGHT || 8; // Default 8 (downgame.js value)
    
    // Logic from downgame.js:
    // Phase 1: G - n/se * 5 (8 -> 3)
    // Phase 2: G - 15 + n/se * 10 (3 -> 13)
    
    if (n < se) {
        // Compress
        this.springHeight = G - (n / se) * 5;
    } else if (n < se * 2) {
        // Expand
        this.springHeight = G - 15 + (n / se) * 10;
    } else {
        // Launch
        player.velocityY = this.config.SPRING_VELOCITY || -0.5;
        player.setGrounded(false);
        player.currentPlatform = null;
        this.onLeave(player, currentTime);
    }
    // this.height = this.springHeight + 4;
  }

  onLeave(player, currentTime) {
    this.leavingTime = currentTime;
    this.restoring = true;
    this.touchTime = 0;
    this.touched = false;
  }

  update(deltaTime, currentTime) {
    if (this.restoring) {
       this.restore(currentTime);
    }
  }

  restore(currentTime) {
      const t = currentTime - this.leavingTime;
      const se = 100;
      const G = this.config.SPRING_HEIGHT || 8;
      
      // downgame.js logic: n = 5 / se * t
      const n = (5 / se) * t; 
      
      if (this.springHeight < G) {
          this.springHeight += n;
          if (this.springHeight >= G) {
              this.springHeight = G;
              this.restoring = false;
          }
      } else if (this.springHeight > G) {
          this.springHeight -= n;
          if (this.springHeight <= G) {
              this.springHeight = G;
              this.restoring = false;
          }
      } else {
          this.restoring = false;
      }
      // this.height = this.springHeight + 4;
  }
  
  get currentHeight() {
      return this.springHeight;
  }
}

class ConveyorPlatform extends Platform {
  constructor(x, y, config, direction) {
    super(x, y, PLATFORM_TYPES.CONVEYOR, config, direction);
    this.animationOffset = 0;
    this.animationCounter = 0;
    this.highlightIndex = 0;
  }

  update(deltaTime, currentTime) {
    // Update arrow animation
    // downgame.js updates offset every frame, but highlight every 7 frames.
    
    if (this.direction === DIRECTIONS.LEFT) {
      this.animationOffset++;
      if (this.animationOffset >= 20) this.animationOffset = 0;
    } else {
      this.animationOffset--;
      if (this.animationOffset < 0) this.animationOffset = 20;
    }

    this.animationCounter++;
    if (this.animationCounter >= 7) {
      this.animationCounter = 0;
      // downgame.js always decrements the index regardless of direction
      this.highlightIndex = (this.highlightIndex - 1 + 4) % 4;
    }
  }

  handleCollision(player) {
    // Initial collision
    return { type: 'conveyor', damage: 0, sound: 'lr' };
  }

  onStanding(player, currentTime) {
      // Apply velocity
      if (this.direction === DIRECTIONS.LEFT) {
          player.vx = -this.config.CONVEYOR_SPEED; // -0.1
      } else {
          player.vx = this.config.CONVEYOR_SPEED; // 0.1
      }
  }

  onLeave(player, currentTime) {
      player.vx = 0;
  }
}

class SpikePlatform extends Platform {
  constructor(x, y, config) {
    super(x, y, PLATFORM_TYPES.SPIKE, config);
  }

  handleCollision(player, currentTime) {
    const damageResult = player.takeDamage(this.config.SPIKE_DAMAGE, currentTime);
    return {
      type: 'spike',
      damage: damageResult ? this.config.SPIKE_DAMAGE : 0,
      sound: damageResult ? (damageResult === 'dead' ? 'dead' : 'hurt') : null
    };
  }

  onStanding(player, currentTime) {
    // Do nothing when standing - damage is only taken on initial collision (landing)
  }

  draw(ctx, platformStyles, renderCache, currentTime) {
      // Draw basic spike
      if (renderCache) {
        const cached = renderCache.get(`spike_${this.width}_${this.height}`, this.width, this.height, (ctx, w, h) => {
          platformStyles.drawSpikePlatform(ctx, 0, 0, w, h, 0);
        });
        ctx.drawImage(cached.canvas, this.x - cached.anchorX, this.y - cached.anchorY);
      } else {
        platformStyles.drawSpikePlatform(ctx, this.x, this.y, this.width, this.height, currentTime || Date.now());
      }
      
      // Add flashing effect from downgame.js
      const t = currentTime || Date.now();
      if (Math.sin(t * 0.003) > 0.7) {
          ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
          // Cover the spike area
          ctx.fillRect(this.x, this.y - this.height - 12, this.width, this.height + 12);
      }
  }
}

class FakePlatform extends Platform {
  constructor(x, y, config) {
    super(x, y, PLATFORM_TYPES.FAKE, config);
    this.height = config.PLATFORM_HEIGHT;
    this.restoring = false;
    this.touchTime = 0;
    this.touched = false;
  }

  update(deltaTime, currentTime) {
    if (this.restoring) {
        this.restore(currentTime);
    }
  }

  draw(ctx, platformStyles, renderCache, currentTime) {
    // Check if platformStyles is provided, otherwise fallback to simple draw
    if (platformStyles) {
       const time = currentTime || Date.now();
       const fullHeight = this.config.PLATFORM_HEIGHT;
       // Always pass currentHeight and time for animation
       platformStyles.drawFakePlatform(
          ctx, this.x, this.y, this.width, fullHeight,
          this.height, time
        );
    } else {
      super.draw(ctx, platformStyles, renderCache, currentTime);
    }
  }

  onStanding(player, currentTime) {
      if (this.touchTime === 0) this.touchTime = currentTime;

      const ue = this.config.FAKE_PLATFORM_DELAY || 100;
      const Y = this.config.FAKE_PLATFORM_DISAPPEAR_TIME || 300;
      const S = this.config.PLATFORM_HEIGHT;
      const n = currentTime - this.touchTime;

      if (n < ue) {
          this.height = S;
      } else if (n < Y) {
          // Shrink phase (linear interpolation from S to 0)
          // Downgame logic:
          this.height = S - (S / (Y - ue)) * (n - ue);
          
          if (isNaN(this.height)) this.height = 0;
          this.height = Math.max(0, this.height);
      } else {
          // Disappeared
          this.height = 0;
          if (player.currentPlatform === this) {
             // Explicitly detach player
             player.setGrounded(false);
             player.currentPlatform = null;
             this.onLeave(player, currentTime);
          }
      }
  }

  checkCollision(player) {
    if (this.height <= 0) return false;
    return super.checkCollision(player);
  }

  handleCollision(player, currentTime) {
    if (this.height <= 0) return null;
    return { type: 'fake', damage: 0, sound: 'roll' };
  }
  
  onLeave(player, currentTime) {
      const ue = this.config.FAKE_PLATFORM_DELAY || 100;
      const Y = this.config.FAKE_PLATFORM_DISAPPEAR_TIME || 300;
      const n = currentTime - this.touchTime;
      
      // Downgame logic: if left during shrink phase, continue restoring (shrinking)
      if (n >= ue && n < Y) {
          this.restoring = true;
      }
  }

  restore(currentTime) {
      const ue = this.config.FAKE_PLATFORM_DELAY || 100;
      const Y = this.config.FAKE_PLATFORM_DISAPPEAR_TIME || 300;
      const S = this.config.PLATFORM_HEIGHT;
      // Use touchTime to continue the original shrinking timeline
      const t = currentTime - this.touchTime;
      
      if (t < Y) {
          this.height = S / (ue - Y) * (t - Y);
          if (isNaN(this.height)) this.height = 0;
          this.height = Math.max(0, this.height);
      } else {
          this.height = 0;
          this.restoring = false;
          this.touched = false;
      }
  }
  
  get currentHeight() {
      return this.height;
  }

  draw(ctx, platformStyles, renderCache, currentTime) {
    const time = currentTime || Date.now();
    const fullHeight = this.config.PLATFORM_HEIGHT;
    platformStyles.drawFakePlatform(ctx, this.x, this.y, this.width, fullHeight, this.height, time);
  }
}

// ============================================================================
// 6. PLATFORM MANAGER - 平台管理器
// ============================================================================

class PlatformManager {
  constructor(config) {
    this.config = config;
    this.levelConfig = config.levelConfig || config.DEFAULT_LEVEL_CONFIG || [];
    this.currentLevel = 0;
    this.platforms = [];
    this.sequence = 0;
    this.lastPlatformY = 0;
  }

  setLevel(level) {
    this.currentLevel = level;
  }

  reset() {
    this.platforms = [];
    this.sequence = 0;
    this.generateInitialPlatforms();
  }

  generateInitialPlatforms() {
    this.platforms = [];
    this.sequence = 0; // Start sequence at 0
    
    // Generate platforms from top (small y) to bottom (large y)
    // Matches downgame.js generateFloor logic which fills up to L (420)
    // All initial platforms get sequence 0 (downgame.js behavior)
    
    let currentY = 0;
    // FIX: Stop before going off-screen. CANVAS_HEIGHT is 459, we want start platform at 420.
    const limit = this.config.CANVAS_HEIGHT - 40; 

    while (currentY < limit) {
      currentY += this.config.PLATFORM_SPACING;
      
      // If we reached the bottom area, create the start platform
      if (currentY >= limit) {
        const startPlatform = new NormalPlatform(
          this.config.CANVAS_WIDTH / 2 - this.config.PLATFORM_WIDTH / 2,
          currentY, 
          this.config
        );
        startPlatform.sequenceNumber = 0;
        this.platforms.push(startPlatform);
      } else {
        // Random platform
        this.generatePlatformAt(currentY, false); // false = do not increment sequence
      }
    }
    
    // Sort by Y (ascending)
    this.platforms.sort((a, b) => a.y - b.y);
    
    this.lastPlatformY = this.platforms[this.platforms.length - 1].y;
    
    // Set sequence to 1 for next generated platforms
    this.sequence = 1;
  }

  generatePlatformAt(y, incrementSequence = true) {
    // downgame.js logic: o = M + Math.round(Math.random() * (Dt - p))
    // M = CANVAS_PADDING (10)
    // Dt = CANVAS_WIDTH - 2 * CANVAS_PADDING (320 - 20 = 300)
    // p = PLATFORM_WIDTH (100)
    
    const M = this.config.CANVAS_PADDING;
    const Dt = this.config.CANVAS_WIDTH - (M * 2);
    const p = this.config.PLATFORM_WIDTH;
    
    const x = M + Math.round(Math.random() * (Dt - p));
    
    const platform = this.createRandomPlatform(x, y);
    if (incrementSequence) {
        platform.sequenceNumber = this.sequence++;
    } else {
        platform.sequenceNumber = 0;
    }
    this.platforms.push(platform);
  }

  createRandomPlatform(x, y) {
    const levelData = this.levelConfig[this.currentLevel] || this.levelConfig[this.levelConfig.length - 1];
    if (!levelData) {
        console.error('Level config missing for level', this.currentLevel);
        return new NormalPlatform(x, y, this.config);
    }
    const chances = levelData.floor_chances || [10, 3, 1, 1, 1, 2];
    
    // Calculate total weight
    const totalWeight = chances.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    // Determine type
    // Mapping based on chances: [normal, fake, spike, conveyorLeft, conveyorRight, spring]
    // 0: Normal
    // 1: Fake
    // 2: Spike (Arrow in config?)
    // 3: Conveyor Left
    // 4: Conveyor Right
    // 5: Spring
    
    let typeIndex = 0;
    let accumulatedWeight = 0;
    for (let i = 0; i < chances.length; i++) {
      accumulatedWeight += chances[i];
      if (random < accumulatedWeight) {
        typeIndex = i;
        break;
      }
    }
    
    if (window.DEBUG_PLATFORMS) {
        console.log('Generating platform type:', typeIndex, 'at', y);
    }
    
    switch (typeIndex) {
      case 0: // Normal
        return new NormalPlatform(x, y, this.config);
      case 1: // Fake
        return new FakePlatform(x, y, this.config);
      case 2: // Spike
        return new SpikePlatform(x, y, this.config);
      case 3: // Conveyor Left
        return new ConveyorPlatform(x, y, this.config, DIRECTIONS.LEFT);
      case 4: // Conveyor Right
        return new ConveyorPlatform(x, y, this.config, DIRECTIONS.RIGHT);
      case 5: // Spring
        return new SpringPlatform(x, y, this.config);
      default:
        return new NormalPlatform(x, y, this.config);
    }
  }


  update(deltaTime, currentTime, scrollSpeed) {
    // Move platforms UP
    // Speed is in px/ms (matching downgame.js 0.1 px/ms)
    // moveAmount = speed * deltaTime
    const moveAmount = scrollSpeed * deltaTime; 
    
    this.platforms.forEach(platform => {
      platform.y -= moveAmount; // Move UP
      platform.update(deltaTime, currentTime);
    });
    
    // Remove platforms that are off screen (top)
    this.platforms = this.platforms.filter(p => 
      p.y + p.height > -50 // Give some buffer
    );
    
    // Generate new platforms at the BOTTOM
    // Find the lowest platform
    let lowestY = -Infinity;
    this.platforms.forEach(p => {
        if (p.y > lowestY) lowestY = p.y;
    });
    
    // If no platforms (shouldn't happen), start at bottom
    if (this.platforms.length === 0) {
        lowestY = 0; 
    }
    
    // Fixed spacing like downgame.js
    const gap = this.config.PLATFORM_SPACING;
    
    // If the gap between lowest platform and bottom of screen is large enough
    if (this.config.CANVAS_HEIGHT - lowestY > gap) {
         // Determine gap for next platform
         const newY = lowestY + gap;
         
         // Only generate if it's within or slightly below screen (to scroll in)
         if (newY < this.config.CANVAS_HEIGHT + 200) {
             this.generatePlatformAt(newY);
         }
    }
  }

  checkCollisions(player, currentTime) {
    for (const platform of this.platforms) {
      if (platform.checkCollision(player)) {
        const result = platform.onCollision(player, currentTime);
        if (result) {
          return { platform, ...result };
        }
      }
    }
    return null;
  }

  draw(ctx, platformStyles, renderCache, currentTime) {
    this.platforms.forEach(platform => {
      platform.draw(ctx, platformStyles, renderCache, currentTime);
    });
  }
}

// ============================================================================
// 7. GAME ENGINE - 游戏主引擎
// ============================================================================

class GameEngine {
  constructor(canvas, config, resources, platformStyles) {
    this.canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
    if (!this.canvas) {
      throw new Error(`Canvas element not found`);
    }
    
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.config = { ...GAME_CONFIG, ...config };
    this.levelConfig = config.levelConfig || config.DEFAULT_LEVEL_CONFIG || GAME_CONFIG.DEFAULT_LEVEL_CONFIG || [];
    this.resources = resources;
    this.platformStyles = platformStyles;
    this.renderCache = new RenderCache();
    
    // Set canvas size
    this.canvas.width = this.config.CANVAS_WIDTH;
    this.canvas.height = this.config.CANVAS_HEIGHT;
    
    // Game objects
    this.player = new Player(this.config, resources);
    this.platformManager = new PlatformManager(this.config);
    
    // Game state
    this.state = GAME_STATES.READY;
    this.score = 0;
    this.bestScore = 0;
    this.level = 0;
    this.soundEnabled = true;
    
    // Physics
    this.gravity = config.GRAVITY;
    this.scrollSpeed = config.PLATFORM_SPEED_BASE;
    
    // Animation
    this.lastFrameTime = 0;
    this.accumulator = 0;
    this.animationId = null;
    this.isRunning = false;
    
    // Theme colors
    this.colors = {
      bg: '#0f0f23'
    };
    
    // Setup theme observer
    this.setupThemeObserver();

    // Setup resize handler
    this.setupResize();
    
    // Events
    this.eventBus = new EventBus();
    
    // Input state
    this.inputState = {
      leftPressed: null,
      rightPressed: null,
      spacePressed: null
    };
    
    // Input
    this.setupInput();
    
    // Load best score
    this.loadBestScore();
    
    // Initialize platforms
    this.platformManager.reset();

    // Styles
    this.platformStyles = PlatformStyles;
    
    // Draw initial frame
    this.prepareStaticLayers();
    this.draw();
  }

  prepareStaticLayers() {
    // 1. Background
    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.width = this.config.CANVAS_WIDTH;
    this.bgCanvas.height = this.config.CANVAS_HEIGHT;
    const bctx = this.bgCanvas.getContext('2d');
    
    const bgImage = this.resources.getImage('background');
    if (bgImage) {
      const pattern = bctx.createPattern(bgImage, 'repeat');
      if (pattern) {
          bctx.fillStyle = pattern;
          bctx.fillRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);
      }
    } else {
        bctx.fillStyle = this.colors.bg;
        bctx.fillRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);
    }

    // 2. Walls
    this.wallsCanvas = document.createElement('canvas');
    this.wallsCanvas.width = this.config.CANVAS_WIDTH;
    this.wallsCanvas.height = this.config.CANVAS_HEIGHT;
    const wctx = this.wallsCanvas.getContext('2d');
    
    const M = 10; // Wall width
    const H = 20; // Wall block height
    const P = this.config.CANVAS_WIDTH;
    const L = this.config.CANVAS_HEIGHT;
    
    // Left Wall
    for (let t = 0; t < L; t += H) {
      wctx.save(); 
      wctx.translate(0, t);
      wctx.fillStyle = "#FFF"; wctx.fillRect(0, 0, M, H);
      wctx.fillStyle = "#D3F8FF"; wctx.fillRect(0, 0, M, 2); wctx.fillRect(0, 0, 2, H);
      wctx.fillStyle = "#000E5C"; wctx.fillRect(0, H - 2, M, 2); wctx.fillRect(M - 2, 0, 2, H);
      wctx.restore();
    }
    
    // Right Wall
    for (let t = 0; t < L; t += H) {
      wctx.save(); 
      wctx.translate(P - M, t);
      wctx.fillStyle = "#FFF"; wctx.fillRect(0, 0, M, H);
      wctx.fillStyle = "#D3F8FF"; wctx.fillRect(0, 0, M, 2); wctx.fillRect(0, 0, 2, H);
      wctx.fillStyle = "#000E5C"; wctx.fillRect(0, H - 2, M, 2); wctx.fillRect(M - 2, 0, 2, H);
      wctx.restore();
    }

      // 3. Ceiling (Spikes)
    this.ceilingCanvas = document.createElement('canvas');
    this.ceilingCanvas.width = this.config.CANVAS_WIDTH;
    this.ceilingCanvas.height = this.config.CANVAS_HEIGHT; // Only needs top part but keeping full size is easier
    const cctx = this.ceilingCanvas.getContext('2d');
    
    // Draw spikes starting from y=0 (canvas padding handles the offset)
    const t = 0;
    
    const n = cctx.createLinearGradient(0, t + 5, P, t + 5);
    n.addColorStop(0, "#FFFFFF"); n.addColorStop(0.5, "#000000"); n.addColorStop(1, "#FFFFFF");
    cctx.fillStyle = n; cctx.fillRect(1, t + 1, P - 2, 8);
    cctx.fillStyle = "#999"; cctx.fillRect(0, t, P, 1); cctx.fillRect(0, t, 1, 10);
    cctx.fillStyle = "#000"; cctx.fillRect(P - 1, t, 1, 10); cctx.fillRect(0, t + 10 - 1, P, 1);
    
    const Z = 5;
    const pe = 15;
    for (let r = 0.5; r < P; r += Z * 2) {
      const s = r, o = r + Z, a = Math.min(r + Z * 2, P - 0.5);
      const c = cctx.createLinearGradient(s, t + pe / 2, a, t + pe / 2);
      c.addColorStop(0, "#333333"); c.addColorStop(0.5, "#FFFFFF"); c.addColorStop(1, "#333333");
      cctx.beginPath(); 
      cctx.moveTo(s, t + 10); 
      cctx.lineTo(o, t + 10 + pe); 
      cctx.lineTo(a, t + 10); 
      cctx.closePath();
      cctx.fillStyle = c; cctx.fill(); 
      cctx.strokeStyle = "#555"; cctx.lineWidth = 0.5; cctx.stroke();
    }
  }

  setupThemeObserver() {
    this.updateThemeColors();
    this.themeObserver = new MutationObserver(() => this.updateThemeColors());
    this.themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  updateThemeColors() {
    const style = getComputedStyle(document.body);
    const bg = style.getPropertyValue('--bg-game').trim();
    if (bg) {
      this.colors.bg = bg;
    }
    // Trigger redraw if not running
    if (!this.isRunning) {
      this.draw();
    }
  }

  setupResize() {
    const handleResize = () => {
      const container = this.canvas.parentElement;
      if (!container) return;
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate scale to fit window
      const scaleX = windowWidth / this.config.CANVAS_WIDTH;
      const scaleY = windowHeight / this.config.CANVAS_HEIGHT;
      const scale = Math.min(scaleX, scaleY, 1.5); // Cap scale at 1.5x for large screens
      
      // But usually mobile games want full width or height fit
      // downgame.js logic:
      // F.style.width = `${P * B}px`, F.style.height = `${L * B}px`
      // where B = m.clientWidth / P (width ratio)
      
      const parentWidth = container.clientWidth;
      const scaleRatio = parentWidth / this.config.CANVAS_WIDTH;
      
      // Apply scale
      this.canvas.style.width = `${this.config.CANVAS_WIDTH * scaleRatio}px`;
      this.canvas.style.height = `${this.config.CANVAS_HEIGHT * scaleRatio}px`;
      
      // Adjust container height to match scaled canvas
      container.style.height = `${this.config.CANVAS_HEIGHT * scaleRatio}px`;
      
      // Redraw after resize
      if (!this.isRunning) {
        this.draw();
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Call once to set initial size
    setTimeout(handleResize, 0);
  }

  setupInput() {
    // Keyboard input
    window.addEventListener('keydown', (e) => {
      // Prevent default for game keys to stop scrolling/browser actions
      if (['ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft') {
        this.inputState.leftPressed = true;
        this.player.isMovingLeft = true;
        this.player.isMovingRight = false;
      }
      if (e.key === 'ArrowRight') {
        this.inputState.rightPressed = true;
        this.player.isMovingRight = true;
        this.player.isMovingLeft = false;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        if (!this.inputState.spacePressed) {
            this.inputState.spacePressed = true;
            this.handleSpacePress();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') {
        this.inputState.leftPressed = null;
        this.player.isMovingLeft = false;
        if (this.inputState.rightPressed) {
            this.player.isMovingRight = true;
        }
      }
      if (e.key === 'ArrowRight') {
        this.inputState.rightPressed = null;
        this.player.isMovingRight = false;
        if (this.inputState.leftPressed) {
            this.player.isMovingLeft = true;
        }
      }
      if (e.key === ' ' || e.key === 'Enter') {
        this.inputState.spacePressed = null;
      }
    });

    // Touch input (Global window listener like downgame.js)
    const handleTouch = (e) => {
      if (e.cancelable) e.preventDefault();
      
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const isLeft = touch.clientX < window.innerWidth * 0.5;

        if (e.type === 'touchstart') {
          if (isLeft) {
              if (this.inputState.leftPressed === null) {
                  this.inputState.leftPressed = touch.identifier;
                  this.player.isMovingLeft = true;
                  this.player.isMovingRight = false;
              }
          } else {
              if (this.inputState.rightPressed === null) {
                  this.inputState.rightPressed = touch.identifier;
                  this.player.isMovingRight = true;
                  this.player.isMovingLeft = false;
              }
          }
        } else if (e.type === 'touchend' || e.type === 'touchcancel') {
           if (touch.identifier === this.inputState.leftPressed) {
              this.inputState.leftPressed = null;
              this.player.isMovingLeft = false;
              if (this.inputState.rightPressed !== null) this.player.isMovingRight = true;
           } else if (touch.identifier === this.inputState.rightPressed) {
              this.inputState.rightPressed = null;
              this.player.isMovingRight = false;
              if (this.inputState.leftPressed !== null) this.player.isMovingLeft = true;
           }
        }
      }
    };

    window.addEventListener('touchstart', handleTouch, { passive: false });
    window.addEventListener('touchend', handleTouch, { passive: false });
    window.addEventListener('touchcancel', handleTouch, { passive: false });
  }

  handleSpacePress() {
    switch (this.state) {
      case GAME_STATES.INITIAL:
      case GAME_STATES.READY:
        this.start();
        break;
      case GAME_STATES.RUNNING:
        this.pause();
        break;
      case GAME_STATES.PAUSED:
        this.resume();
        break;
      case GAME_STATES.GAMEOVER:
        this.restart();
        break;
    }
  }

  start() {
    if (this.isRunning) return;
    
    // Ensure static layers are ready
    if (!this.ceilingCanvas) {
        this.prepareStaticLayers();
    }
    
    this.platformManager.reset();
    
    // Force player to start ON the bottom platform
    const platforms = this.platformManager.platforms;
    if (platforms.length > 0) {
        // The last platform is the bottom-most one (start platform)
        const startPlatform = platforms[platforms.length - 1];
        
        // Reset player state
        this.player.reset();
        
        // Position player on the center of the start platform
        this.player.x = startPlatform.x + (startPlatform.width - this.config.PLAYER_WIDTH) / 2;
        this.player.y = startPlatform.y - startPlatform.height;
        this.player.setGrounded(true, startPlatform);
        
        // Safety check for NaN
        if (isNaN(this.player.x) || isNaN(this.player.y)) {
             console.error('Calculated player position is NaN! Resetting to safe default.');
             this.player.x = this.config.CANVAS_WIDTH / 2 - this.config.PLAYER_WIDTH / 2;
             this.player.y = this.config.CANVAS_HEIGHT - 100; // Safe height
             this.player.setGrounded(false);
        }
        
        console.log(`Game starting... Player placed on platform at (${this.player.x}, ${this.player.y})`);
    } else {
        console.error('No platforms generated! Player might fall.');
    }

    this.state = GAME_STATES.RUNNING;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.accumulator = 0;
    this.eventBus.emit('gameStart', {});
    this.gameLoop(performance.now());
  }

  pause() {
    if (!this.isRunning) return;
    this.state = GAME_STATES.PAUSED;
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.eventBus.emit('gamePause', {});
  }

  resume() {
    if (this.isRunning) return;
    this.state = GAME_STATES.RUNNING;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.accumulator = 0;
    this.eventBus.emit('gameResume', {});
    this.gameLoop(performance.now());
  }

  restart() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.score = 0;
    this.level = 0;
    
    // Reset platforms FIRST
    this.platformManager.reset();
    
    // Reset player and place on start platform
    this.player.reset();
    const platforms = this.platformManager.platforms;
    if (platforms.length > 0) {
        const startPlatform = platforms[platforms.length - 1];
        this.player.x = startPlatform.x + (startPlatform.width - this.config.PLAYER_WIDTH) / 2;
        this.player.y = startPlatform.y - startPlatform.height;
        this.player.setGrounded(true, startPlatform);

        // Safety check for NaN
        if (isNaN(this.player.x) || isNaN(this.player.y)) {
             console.error('Calculated player position is NaN! Resetting to safe default.');
             this.player.x = this.config.CANVAS_WIDTH / 2 - this.config.PLAYER_WIDTH / 2;
             this.player.y = this.config.CANVAS_HEIGHT - 100; // Safe height
             this.player.setGrounded(false);
        }
    }
    
    this.gravity = this.config.GRAVITY;
    this.scrollSpeed = this.config.PLATFORM_SPEED_BASE;
    this.state = GAME_STATES.RUNNING;
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    this.accumulator = 0;
    this.eventBus.emit('gameRestart', {});
    this.gameLoop(performance.now());
  }

  gameOver() {
    if (this.state === GAME_STATES.GAMEOVER || this.state === GAME_STATES.COOLDOWN) return;

    this.state = GAME_STATES.COOLDOWN;
    this.isRunning = false;
    
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.saveBestScore();
    }

    // Delay showing game over screen (cooldown)
    setTimeout(() => {
        this.state = GAME_STATES.GAMEOVER;
        this.eventBus.emit('gameOver', { score: this.score, bestScore: this.bestScore });
    }, 1500);
  }

  gameLoop(currentTime) {
    if (!this.isRunning) {
      return;
    }

    if (this.state === GAME_STATES.PAUSED) {
      return;
    }

    try {
      const deltaTime = currentTime - this.lastFrameTime;
      this.lastFrameTime = currentTime;
      
      // Cap deltaTime
      let timeToProcess = deltaTime;
      if (timeToProcess > 1000) timeToProcess = 1000;
      
      const frameTime = this.config.FRAME_TIME || 20;

      // Sub-step update (match downgame.js logic)
      while (timeToProcess >= frameTime) {
         this.update(frameTime, currentTime - timeToProcess);
         timeToProcess -= frameTime;
      }
      
      if (timeToProcess > 0) {
         this.update(timeToProcess, currentTime);
      }

      // Draw
      this.draw(currentTime);

      // Check game over
    if (this.player.isDead) {
      this.gameOver();
      return;
    }

    // Continue loop
    this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
  } catch (error) {
      console.error('Game loop error:', error);
      this.isRunning = false;
      this.eventBus.emit('error', { error: error.message });
    }
  }

  update(deltaTime, currentTime) {
    // Track previous HP to detect healing
    const oldHp = this.player.hp;

    // 1. Update platforms (move UP)
    this.platformManager.update(deltaTime, currentTime, this.scrollSpeed);

    // 2. Update player horizontal movement and animation state
    this.player.update(deltaTime, currentTime);
    
    // Check for healing
    if (this.player.hp > oldHp) {
        this.eventBus.emit('playerHealed', { hp: this.player.hp });
    }
    
    // 3. Handle Vertical Physics & Collisions
    if (this.player.onGround && this.player.currentPlatform) {
      const platform = this.player.currentPlatform;
      
      // Check if player is still on the platform
      const playerBox = this.player.getHitbox();
      const onPlatform = 
        playerBox.x + playerBox.width > platform.x &&
        playerBox.x < platform.x + platform.width;
        
      if (onPlatform) {
        // Apply platform effects (conveyor, spring compression, fake collapse)
        // This might change player velocity or grounded state
        platform.onStanding(this.player, currentTime);
        
        // Check if we are still grounded after onStanding (e.g. spring might have launched us)
        if (this.player.onGround) {
            // Snap to platform surface (Feet = Surface)
            // Surface is at platform.y - currentHeight
            // Player Top is Surface - player.height
            // We use currentHeight to ensure player sinks with shrinking platforms (FakePlatform)
            // or moves with expanding platforms (SpringPlatform)
            const currentHeight = platform.currentHeight !== undefined ? platform.currentHeight : platform.config.PLATFORM_HEIGHT;
            // Align player feet (y) with platform surface (y - currentHeight)
            this.player.y = platform.y - currentHeight;
            this.player.velocityY = 0;
        }
      } else {
        // Walked off platform
        platform.onLeave(this.player, currentTime);
        this.player.setGrounded(false, null);
      }
    } 
    
    // If not on ground (or just walked off), apply gravity and check collisions
    if (!this.player.onGround) {
      // Apply gravity
      this.player.velocityY += this.config.GRAVITY * deltaTime;
      
      // Limit terminal velocity
      if (this.player.velocityY > this.config.MAX_VELOCITY) {
        this.player.velocityY = this.config.MAX_VELOCITY;
      }
      
      // Move player
      const deltaY = this.player.velocityY * deltaTime;
      const nextY = this.player.y + deltaY;
      
      this.player.y = nextY;
      
      const collision = this.platformManager.checkCollisions(this.player, currentTime);
      if (collision) {
        this.handleCollision(collision);
      }
    }
    
    // 5. Check boundaries
    // Top boundary (Ceiling)
    // Spikes are drawn at y=0 with height ~15px
    const topLimit = 15;
    
    // Check if player's TOP touches the spikes
    // Player y is at the feet, so top is y - height
    if (this.player.y - this.config.PLAYER_HEIGHT < topLimit) {
      this.player.y = topLimit + this.config.PLAYER_HEIGHT; // Snap to limit (feet position)
      this.player.velocityY = 0;
      // Play sound for top spikes
      const dmg = this.player.takeDamage(this.config.CEILING_DAMAGE || 5, currentTime);
      if (dmg) { // Only play sound if damage was taken (invulnerability check passed)
         this.playSound(dmg === 'dead' ? 'dead' : 'hurt');
         this.eventBus.emit('playerHurt', { hp: this.player.hp, damage: this.config.CEILING_DAMAGE || 5 });
      }
      
      if (this.player.onGround) {
          if (this.player.currentPlatform) {
              this.player.currentPlatform.onLeave(this.player, currentTime);
          }
          this.player.setGrounded(false, null);
      }
    }
    
    // Bottom boundary (Game Over)
    if (this.player.y > this.config.CANVAS_HEIGHT) {
        if (!this.player.isDead) {
            console.log('Player fell off screen at Y:', this.player.y);
            this.playSound('dead');
            this.player.hp = 0;
            this.player.isDead = true;
            this.player.deathTime = Date.now();
            this.eventBus.emit('playerHurt', { hp: 0, damage: 999 });
        }
    }
    
    // Update difficulty based on levelConfig
    this.updateLevel();
  }

  updateLevel() {
    // FIX: Use actual levelConfig from this.levelConfig, NOT default
    const levelConfig = this.levelConfig;
    
    // 1. Check for defined levels
    while (
      this.level < levelConfig.length - 1 && 
      this.score >= levelConfig[this.level + 1].level_threshold
    ) {
      this.level++;
      const levelData = levelConfig[this.level];
      
      // Update scroll speed
      this.scrollSpeed = this.config.PLATFORM_SPEED_BASE * levelData.speed_boost;
      
      // Update platform manager level
      this.platformManager.setLevel(this.level);
      
      console.info(`Difficulty increased to level: ${this.level}, at score: ${this.score}, speed boost: ${levelData.speed_boost}`);
      this.eventBus.emit('levelUp', { level: this.level });
    }

    // 2. Handle infinite scaling beyond defined levels
    // Matches downgame.js implementation
    if (this.level >= levelConfig.length - 1) {
      const lastConfig = levelConfig[levelConfig.length - 1];
      const extraScore = this.score - lastConfig.level_threshold;
      
      if (extraScore > 0) {
        // Increase speed by 0.5% per extra floor
        // 100 extra floors = 50% speed increase
        const extraBoost = extraScore * 0.005;
        const newBoost = lastConfig.speed_boost + extraBoost;
        
        this.scrollSpeed = this.config.PLATFORM_SPEED_BASE * newBoost;
        
        // Log occasionally
        if (this.score % 10 === 0) {
           // Throttle logs slightly to avoid spam
           if (!this._lastLogScore || this._lastLogScore !== this.score) {
               console.info(`Infinite difficulty: score ${this.score}, speed boost ${newBoost.toFixed(3)}`);
               this._lastLogScore = this.score;
           }
        }
      }
    }
  }

  handleCollision(collision) {
    const { platform, type, damage, sound } = collision;
    
    // Play sound
    if (sound && this.soundEnabled) {
      this.playSound(sound);
    }
    
    // Handle damage and emit HP update
    if (damage > 0) {
      const oldHp = this.player.hp;
      this.eventBus.emit('playerHurt', { hp: this.player.hp, damage });
    }
    
    // Reset velocity on normal landing
    if (type === 'normal' || type === 'fake' || type === 'conveyor' || type === 'spike' || type === 'spring') {
      this.player.velocityY = 0;
      this.player.setGrounded(true, platform);
      this.player.y = platform.y - this.player.height;
      
      // Update score if this is a new platform
      // Score calculation: 1 point for every 5 platforms (matching downgame.js)
      const currentScore = Math.floor(platform.sequenceNumber * 0.2);
      
      if (currentScore > this.score) {
          this.score = currentScore;
          this.eventBus.emit('scoreUpdate', { score: this.score });
      }
    }
  }

  draw(currentTime) {
    const time = currentTime || Date.now();

    // 1. Draw background (pre-rendered)
    if (this.bgCanvas) {
        this.ctx.drawImage(this.bgCanvas, 0, 0);
    } else {
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(0, 0, this.config.CANVAS_WIDTH, this.config.CANVAS_HEIGHT);
    }
    
    // 2. Draw walls (pre-rendered)
    if (this.wallsCanvas) {
        this.ctx.drawImage(this.wallsCanvas, 0, 0);
    }
    
    // 3. Draw platforms
    this.platformManager.draw(this.ctx, this.platformStyles, this.renderCache, time);
    
    // Draw player
    this.player.draw(this.ctx, time);

    // 5. Draw ceiling (pre-rendered) - Draw last to cover player if he jumps too high
    if (!this.ceilingCanvas) {
        console.warn('Ceiling canvas missing in draw(), recreating...');
        this.prepareStaticLayers();
    }
    if (this.ceilingCanvas) {
        this.ctx.drawImage(this.ceilingCanvas, 0, 0);
    }
    
    // 6. Draw Debug Overlay
    if (window.DEBUG_PLAYER || window.FORCE_DEBUG_PLAYER) {
        this.drawDebugOverlay();
    }
  }

  drawDebugOverlay() {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(5, 50, 200, 100);
      ctx.fillStyle = '#00FF00';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      
      const p = this.player;
      const lines = [
          `State: ${this.state}`,
          `Player Pos: (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`,
          `Vel Y: ${p.velocityY.toFixed(3)}`,
          `OnGround: ${p.onGround}`,
          `Platforms: ${this.platformManager.platforms.length}`,
          `Scroll Speed: ${this.scrollSpeed.toFixed(3)}`,
          `Frame: ${p.animationFrame} | State: ${p.currentState}`
      ];
      
      lines.forEach((line, i) => {
          ctx.fillText(line, 10, 65 + i * 14);
      });
      ctx.restore();
  }



  playSound(soundKey) {
    const sound = this.resources.getSound(soundKey);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore play errors (user interaction required, etc.)
      });
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.eventBus.emit('soundToggle', { enabled: this.soundEnabled });
  }

  loadBestScore() {
    const saved = localStorage.getItem('downdd-best');
    if (saved) {
      this.bestScore = parseInt(saved, 10);
    }
  }

  saveBestScore() {
    localStorage.setItem('downdd-best', this.bestScore.toString());
  }

  clearBestScore() {
    this.bestScore = 0;
    localStorage.removeItem('downdd-best');
    this.eventBus.emit('bestScoreCleared', {});
  }

  getGameState() {
    return {
      state: this.state,
      score: this.score,
      bestScore: this.bestScore,
      level: this.level,
      hp: this.player.hp,
      soundEnabled: this.soundEnabled
    };
  }

  on(eventName, callback) {
    this.eventBus.on(eventName, callback);
  }

  off(eventName, callback) {
    this.eventBus.off(eventName, callback);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.eventBus.clear();
  }
}

// ============================================================================
// 8. MAIN EXPORT - 主导出类
// ============================================================================

export default class DownGame {
  static async init(containerOrSelector, config = {}) {
    let container;
    if (typeof containerOrSelector === 'string') {
      container = document.querySelector(containerOrSelector);
    } else {
      container = containerOrSelector;
    }

    if (!container) {
      throw new Error(`Container not found`);
    }

    // Show loading with progress bar (referencing original engine style)
    // Clear container first
    container.innerHTML = '';
    
    // Create loading structure matching downgame.js style
    const loadingContainer = document.createElement('div');
    loadingContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      background: #eee;
    `;
    
    const progressBarContainer = document.createElement('div');
    progressBarContainer.style.cssText = `
      height: 30px;
      width: 60%;
      border: solid 2px #999;
      margin: auto;
      background: #fff;
    `;
    
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      width: 0%;
      height: 100%;
      background: #999;
      transition: width 0.1s linear;
    `;
    
    progressBarContainer.appendChild(progressBar);
    loadingContainer.appendChild(progressBarContainer);
    container.appendChild(loadingContainer);

    // Progress bar simulation
    const updateProgress = (percent) => {
        progressBar.style.width = `${percent}%`;
    };

    let progress = 0;
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += Math.random() * 5 + 1; // Random increment
            if (progress > 90) progress = 90;
            updateProgress(progress);
        }
    }, 50);

    // Merge config with defaults
    const finalConfig = { ...GAME_CONFIG, ...config };
    const basePath = config.root || './';

    // Load resources
    const resources = new ResourceLoader(basePath);
    let resourcesLoaded = false;
    try {
      await resources.loadAllResources();
      resourcesLoaded = true;
      console.log('All resources loaded successfully');
    } catch (error) {
      console.error('Failed to load resources:', error);
      // We continue, as the engine has fallbacks (colors instead of images)
    }

    // Finish loading animation
    clearInterval(progressInterval);
    updateProgress(100);
    await new Promise(resolve => setTimeout(resolve, 300)); // Small delay to show 100%

    // Load platform styles
    let platformStyles = null;
    try {
      const module = await import('./platform-styles.js');
      platformStyles = module.PlatformStyles;
    } catch (error) {
      console.warn('Platform styles not loaded, using fallback rendering');
    }

    // Load CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = basePath + 'downgame.css';
    document.head.appendChild(cssLink);
    
    // Create game canvas and container
    // Ensure explicit height for overlay positioning
    const totalHeight = finalConfig.CANVAS_HEIGHT + 39; // 420 + 39 = 459
    container.innerHTML = `
      <div class="downfloor-container" style="width: 100%; max-width: 640px; height: ${totalHeight}px; margin: 0 auto; position: relative;">
        <canvas id="downfloor-canvas" class="downfloor-canvas"></canvas>
      </div>
    `;

    // Wait for CSS to load (briefly)
    await new Promise(resolve => setTimeout(resolve, 100));

    // Initialize game engine
    const engine = new GameEngine('downfloor-canvas', finalConfig, resources, platformStyles);
    
    // Setup UI
    setupGameUI(container, engine);

    // Force a redraw after a short delay to ensure everything is rendered
    requestAnimationFrame(() => {
      engine.draw();
      setTimeout(() => engine.draw(), 100);
    });

    return engine;
  }
}

// ============================================================================
// 9. UI SETUP - UI 设置
// ============================================================================

function setupGameUI(container, engine) {
  const downfloorContainer = container.querySelector('.downfloor-container');
  if (!downfloorContainer) {
    console.error('downfloor-container not found');
    return;
  }

  // Inject Custom Styles for UI Consistency and New Elements
  const styleId = 'downfloor-custom-styles';
  if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
          /* Force consistent width for all game buttons and boxes */
          .downfloor-container .downfloor-game-button,
          .downfloor-container .downfloor-best-score,
          .downfloor-container .downfloor-reset-button {
              width: 320px !important;
              box-sizing: border-box !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              justify-content: center !important;
              text-align: center !important;
          }

          .downfloor-container .downfloor-game-button {
              padding: 20px 0 !important;
          }

          /* Styles for Best Score and Reset Button (New Elements) */
          .downfloor-container .downfloor-best-score,
          .downfloor-container .downfloor-reset-button {
              font-size: 17px;
              font-family: 'Inter', sans-serif;
              font-weight: 600;
              color: #d1d5db;
              padding: 12px 16px;
              background: rgba(30, 30, 50, 0.6);
              border: 1px solid rgba(96, 165, 250, 0.2);
              border-radius: 8px;
              backdrop-filter: blur(10px);
              cursor: default;
          }

          .downfloor-container .downfloor-reset-button {
              cursor: pointer;
              transition: all 0.2s ease;
          }

          .downfloor-container .downfloor-reset-button:hover {
              background: rgba(30, 30, 50, 0.8);
              border-color: rgba(96, 165, 250, 0.4);
              color: #f3f4f6;
              transform: translateY(-2px);
          }

          /* Modal Styles */
          .downfloor-container .downfloor-modal-container {
              position: absolute;
              inset: 0;
              margin: 0;
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              opacity: 0;
              visibility: hidden;
              overscroll-behavior: contain;
              z-index: 999;
              background-color: rgba(15, 15, 35, 0.9);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              overflow-y: hidden;
              border: none;
              pointer-events: auto !important;
          }

          .downfloor-container .downfloor-modal-box {
              width: 85%;
              max-width: 400px;
              background: rgba(30, 30, 50, 0.95);
              border: 1px solid rgba(96, 165, 250, 0.3);
              border-radius: 16px;
              box-shadow: 
                  0 25px 50px rgba(0, 0, 0, 0.5),
                  0 0 0 1px rgba(255, 255, 255, 0.1);
              overflow-y: auto;
              overscroll-behavior: contain;
              padding: 24px;
              font-family: 'Inter', sans-serif;
              animation: modal-pop 0.3s ease-out;
          }

          @media only screen and (max-width: 600px) {
              .downfloor-container .downfloor-modal-box {
                  width: 90%;
                  padding: 20px;
              }
          }

          .downfloor-container .downfloor-modal-text {
              font-size: 18px;
              font-weight: 600;
              margin-bottom: 20px;
              color: #f3f4f6;
              line-height: 1.5;
          }

          .downfloor-container .downfloor-modal-action {
              margin-top: 24px;
              display: flex;
              gap: 12px;
              justify-content: flex-end;
          }

          .downfloor-container .downfloor-modal-btn {
              font-family: 'Inter', sans-serif;
              cursor: pointer;
              padding: 10px 20px;
              border: 1px solid transparent;
              font-size: 15px;
              text-align: center;
              font-weight: 600;
              user-select: none;
              touch-action: manipulation;
              border-radius: 8px;
              transition: all 0.2s ease;
          }

          .downfloor-container .downfloor-modal-btn:hover {
              transform: translateY(-1px);
          }

          .downfloor-container .downfloor-modal-btn:not(.reset-button) {
              color: #9ca3af;
              background: rgba(75, 85, 99, 0.5);
              border-color: rgba(156, 163, 175, 0.3);
          }

          .downfloor-container .downfloor-modal-btn:not(.reset-button):hover {
              background: rgba(75, 85, 99, 0.7);
              color: #d1d5db;
          }

          .downfloor-container .reset-button {
              color: #ffffff;
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              border-color: rgba(239, 68, 68, 0.5);
              box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }

          .downfloor-container .reset-button:hover {
              background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
              box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
          }
      `;
      document.head.appendChild(style);
  }
  
  // Ensure container has relative positioning for absolute children
  downfloorContainer.style.position = 'relative';
  
  // FIX: Restore standard CSS behavior - let padding-top handle the offset
  // We do NOT override padding here anymore
  const canvas = downfloorContainer.querySelector('canvas');
  if (canvas) {
      // Ensure canvas respects the CSS padding
      canvas.style.paddingTop = ''; // Clear any inline override
  }
  
  const { i18n } = engine.config;
  const text = {
    life: i18n?.life || 'LIFE',
    score: i18n?.score || 'Floor:',
    best: i18n?.best || 'Best:',
    start: i18n?.start || 'Start Game',
    restart: i18n?.restart || 'Try Again',
    gameOver: i18n?.gameOver || 'Game Over',
    finalScore: i18n?.score || 'Floor:',
    soundOn: i18n?.soundOn || 'Sound: ON',
    soundOff: i18n?.soundOff || 'Sound: OFF',
    resetConfirm: i18n?.resetConfirm || 'Are you sure you want to reset the best score?',
    confirm: i18n?.confirm || 'Confirm',
    cancel: i18n?.cancel || 'Cancel',
    reset: i18n?.reset || 'RESET'
  };
  
    // Create overlay container that wraps everything to match downgame.js structure
    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'downfloor-overlay-container ready';
    
    // Create top bar
    const topBar = document.createElement('div');
    topBar.className = 'downfloor-topbar';
    // FIX: Restore absolute positioning to ensure correct width and padding handling (left:0, right:0 from CSS)
    // topBar.style.position = 'relative'; // REMOVED: Caused layout issues (sound button moved to left)
    topBar.style.background = 'rgba(30, 30, 50, 0.95)'; // Ensure background is opaque
    topBar.innerHTML = `
      <div class="downfloor-life-container">
        <span class="downfloor-life-label">${text.life}</span>
        <div class="downfloor-life-bar">
          ${Array.from({ length: 10 }, (_, i) => `<div class="downfloor-life-bar-unit" data-index="${i}"></div>`).join('')}
        </div>
      </div>
      <div class="downfloor-score-container">
        <div class="downfloor-score">${text.score} <span id="current-score">0</span></div>
        <button class="downfloor-sound-toggle" id="sound-toggle" title="${engine.soundEnabled ? text.soundOn : text.soundOff}">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" class="downfloor-sound-icon ${engine.soundEnabled ? 'sound-on' : 'sound-off'}">
             <g fill="#fff" fill-rule="nonzero">
               <path d="M122 39c5 2 8 7 8 12v154c0 5-3 10-8 12s-10 1-14-3l-49-47H25c-7 0-13-6-13-13v-52c0-7 6-13 13-13h34l49-47c4-4 9-5 14-3ZM187 37c5-5 13-5 18 0a128 128 0 0 1 0 183c-5 5-13 5-18 0-5-6-5-14 0-19a102 102 0 0 0 0-146c-5-5-5-13 0-18Z"></path>
               <path d="M150 73c5-5 13-5 18 0a78 78 0 0 1 23 55c0 21-8 40-23 54-5 5-13 5-18 0s-5-13 0-18a51 51 0 0 0 0-73c-5-5-5-13 0-18Z"></path>
             </g>
          </svg>
        </button>
      </div>
    `;
    
    // Create game controls
    const gameControls = document.createElement('div');
    gameControls.className = 'downfloor-game-controls';
    // Ensure parent flex properties are respected by children wrapper
    gameControls.innerHTML = `
      <div id="controls-ready" style="display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
         <button class="downfloor-game-button start-button" id="start-button">
           ${text.start}
           <span class="downfloor-game-button-hint">(Space / Enter)</span>
         </button>
         <div class="downfloor-best-score">${text.best} <span id="best-score">${engine.bestScore}</span></div>
         <div class="downfloor-reset-button" id="reset-button">${text.reset}</div>
      </div>
      
      <div id="controls-paused" style="display: none; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
         <button class="downfloor-game-button continue-button" id="continue-button">
           Continue
           <span class="downfloor-game-button-hint">(Space / Enter)</span>
         </button>
      </div>
      
      <div id="controls-gameover" style="display: none; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
         <button class="downfloor-game-button restart-button" id="restart-button">
           ${text.restart}
           <span class="downfloor-game-button-hint">(Space / Enter)</span>
         </button>
         <div class="downfloor-best-score">${text.best} <span id="gameover-best-score">${engine.bestScore}</span></div>
         <div class="downfloor-reset-button" id="gameover-reset-button">${text.reset}</div>
      </div>
    `;
    
    // Create Modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'downfloor-modal-container';
    modalContainer.id = 'downfloor-modal';
    modalContainer.innerHTML = `
      <div class="downfloor-modal-box">
        <div class="downfloor-modal-text">${text.resetConfirm}</div>
        <div class="downfloor-modal-action">
          <button type="button" class="downfloor-modal-btn reset-button" id="confirm-reset">${text.confirm}</button>
          <button type="button" class="downfloor-modal-btn" id="cancel-reset">${text.cancel}</button>
        </div>
      </div>
    `;
    
    overlayContainer.appendChild(topBar);
    overlayContainer.appendChild(gameControls);
    // overlayContainer.appendChild(modalContainer); // MOVED: Append directly to downfloorContainer to avoid pointer-events issues
    downfloorContainer.appendChild(overlayContainer);
    downfloorContainer.appendChild(modalContainer); // Append modal last to be on top
    
    // Event handlers
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const continueButton = document.getElementById('continue-button');
    const resetButton = document.getElementById('reset-button');
    const gameoverResetButton = document.getElementById('gameover-reset-button');
    const soundToggle = document.getElementById('sound-toggle');
    const currentScoreEl = document.getElementById('current-score');
    const bestScoreEl = document.getElementById('best-score');
    const gameoverBestScoreEl = document.getElementById('gameover-best-score');
    const lifeUnits = topBar.querySelectorAll('.downfloor-life-bar-unit');
    const controlsReady = document.getElementById('controls-ready');
    const controlsPaused = document.getElementById('controls-paused');
    const controlsGameover = document.getElementById('controls-gameover');
    
    const modal = document.getElementById('downfloor-modal');
    const confirmResetBtn = document.getElementById('confirm-reset');
    const cancelResetBtn = document.getElementById('cancel-reset');
    
    startButton.addEventListener('click', () => engine.start());
    restartButton.addEventListener('click', () => engine.restart());
    continueButton.addEventListener('click', () => engine.resume());
    soundToggle.addEventListener('click', () => engine.toggleSound());
    
    // Modal Logic
    const showModal = () => {
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
    };
    const hideModal = () => {
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
    };
    
    resetButton.addEventListener('click', showModal);
    gameoverResetButton.addEventListener('click', showModal);
    
    confirmResetBtn.addEventListener('click', () => {
        engine.clearBestScore();
        bestScoreEl.textContent = '0';
        gameoverBestScoreEl.textContent = '0';
        hideModal();
    });
    
    cancelResetBtn.addEventListener('click', hideModal);
    
    // Update UI based on game events
    engine.on('gameStart', () => {
      overlayContainer.className = 'downfloor-overlay-container running';
      // Hide all controls
      controlsReady.style.display = 'none';
      controlsPaused.style.display = 'none';
      controlsGameover.style.display = 'none';
      
      // Reset life bar
      lifeUnits.forEach(unit => unit.classList.add('active'));
    });
    
    engine.on('gameRestart', () => {
      overlayContainer.className = 'downfloor-overlay-container running';
      controlsReady.style.display = 'none';
      controlsPaused.style.display = 'none';
      controlsGameover.style.display = 'none';
      currentScoreEl.textContent = '0';
      
      // Reset life bar
      lifeUnits.forEach(unit => unit.classList.add('active'));
    });
    
    engine.on('gamePause', () => {
      overlayContainer.className = 'downfloor-overlay-container paused';
      controlsReady.style.display = 'none';
      controlsPaused.style.display = 'flex'; // Use flex
      controlsGameover.style.display = 'none';
    });
    
    engine.on('gameResume', () => {
      overlayContainer.className = 'downfloor-overlay-container running';
      controlsReady.style.display = 'none';
      controlsPaused.style.display = 'none';
      controlsGameover.style.display = 'none';
    });
    
    engine.on('gameOver', (data) => {
      overlayContainer.className = 'downfloor-overlay-container gameover';
      controlsReady.style.display = 'none';
      controlsPaused.style.display = 'none';
      controlsGameover.style.display = 'flex'; // Use flex
      gameoverBestScoreEl.textContent = data.bestScore;
    });
  
  engine.on('scoreUpdate', (data) => {
    currentScoreEl.textContent = data.score;
  });
  
  engine.on('playerHurt', (data) => {
    lifeUnits.forEach((unit, index) => {
      if (index < data.hp) {
        unit.classList.add('active');
      } else {
        unit.classList.remove('active');
      }
    });
  });
  
  engine.on('playerHealed', (data) => {
    lifeUnits.forEach((unit, index) => {
      if (index < data.hp) {
        unit.classList.add('active');
      } else {
        unit.classList.remove('active');
      }
    });
  });
  
  engine.on('soundToggle', (data) => {
    const icon = soundToggle.querySelector('.downfloor-sound-icon');
    if (data.enabled) {
      icon.classList.remove('sound-off');
      icon.classList.add('sound-on');
      soundToggle.title = text.soundOn;
    } else {
      icon.classList.remove('sound-on');
      icon.classList.add('sound-off');
      soundToggle.title = text.soundOff;
    }
  });
  
  // Initialize life bar
  const currentHp = engine.player.hp !== undefined ? engine.player.hp : engine.config.PLAYER_MAX_HP;
  console.log('Initializing life bar with HP:', currentHp);
  
  lifeUnits.forEach((unit, index) => {
    if (index < currentHp) {
      unit.classList.add('active');
    } else {
      unit.classList.remove('active');
    }
  });
}

