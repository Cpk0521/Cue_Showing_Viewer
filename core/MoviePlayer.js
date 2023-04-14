class MoviePlayerClass{

    _loader = PIXI.Assets
    _url = 'https://raw.githubusercontent.com/Cpk0521/Cue_Showing_Viewer/'
    constructor(){
        this._container = new PIXI.Container()
        this._videoSprite = null
        this._audio = []
        this._showingId = ''
    }

    setUp(PixiApp){
        this._gameapp = PixiApp
        this.addTo(this._gameapp?.mainContainer)
    }

    async _waitingToch(){
        let touchToStartimg = await this._loader.load(`${this._url}/Assets/common/Common_TouchScreenText.png`)
        let touchToStart = new PIXI.Sprite(touchToStartimg);
        this._gameapp?.mainContainer.addChild(touchToStart)

        touchToStart.anchor.set(0.5);
        touchToStart.position.set(this._gameapp?.appSize.width / 2  , this._gameapp?.appSize.height / 2);

        const callback = ()=>{
            this._gameapp?.mainContainer.removeChild(touchToStart)
            this._gameapp?.App.view.removeEventListener('click', callback)
            this._gameapp?.App.view.removeEventListener('touchstart', callback)
            this.onPlayVideo()
        }

        this._gameapp?.App.view.addEventListener('click', callback);
        this._gameapp?.App.view.addEventListener('touchstart', callback);
    }

    addTo(parent){
        parent?.addChild(this._container)
    }

    async load(src = '', hero_posit){

        let Data = await this._loader.load(src)

        if(!Data){
            return 
        }

        let {id, movie, soundClip} = Data

        this._showingId = id.toString().padStart(2, '0')

        //video 
        let ratio = (GameApp.appSize.height / 1080)
        let texture = PIXI.Texture.from(`${this._url}/Assets/movie/${movie}`);
        texture.baseTexture.resource.autoPlay = false
        this._videoSprite = new PIXI.Sprite(texture);
        
        this._videoSprite.width = 1920 * ratio
        this._videoSprite.height = 1080 * ratio;
        this._videoSprite.anchor.set(0.5)
        this._videoSprite.position.set(this._gameapp?.appSize.width /2 , this._gameapp?.appSize.height /2)

        //sound
        soundClip.forEach(async (clip) => {
            let posit = clip.charid
            let hero = hero_posit[`hero_posit_${posit}`]
            let soundurl = `${this._url}/Assets/audio/${hero.toString().padStart(3, '0')}/Showing_${hero.toString().padStart(3, '0')}_${this._showingId}${posit.toString().padStart(2, '0')}/anime_${hero.toString().padStart(2, '0')}_${this._showingId}${posit.toString().padStart(2, '0')}_${clip.clipid}.mp3`

            const sound = await PIXI.sound.Sound.from({
                url: soundurl,
                preload: true,
                loaded: function() {
                    console.log(`Sound loaded`);
                }
            });

            this._audio.push({
                delayTime : clip.Time,
                clip : sound
            })

        });
        
        this._waitingToch()
    }

    onPlayVideo(){
        let controller = this._videoSprite.texture.baseTexture.resource.source;
    
        if(this._container.children.length > 1){
            this._container.removeChildAt(1)
        }

        this._container.addChild(this._videoSprite)
        this._container.visible = true
        
        this._gameapp.Ticker.add((delta) => this.update(delta, controller))
        controller.play()

        controller.onended = ()=>{
            this._container.removeChild(this._videoSprit);
            this._container.visible = false
            this._gameapp.Ticker.remove((delta) => this.update(delta, controller))

            setTimeout(() => {
                window.location.replace(`./#${this._showingId}`)
            }, 1500);
        }
    }

    update(delta, controller){
        // let _times += (1 / 60) * delta;
        let _timenow = controller.currentTime * 1000      
        this._audiocheck(_timenow)
    }

    _audiocheck(timenow){
        if(this._audio.length === 0){
            return
        }

        if(this._audio[0].delayTime -3 > timenow){
            return
        }

        let clip = this._audio.shift();

        if(clip.delayTime -3 <= timenow){
            clip.clip.play()
        }

        this._audiocheck(timenow)
    }

}

const MoviePlayer = new MoviePlayerClass()
