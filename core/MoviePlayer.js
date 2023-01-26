class MoviePlayerClass{

    _loader = PIXI.Assets
    constructor(){
        this._container = new PIXI.Container()
        this._videoSprite = null
        this._audio = []
        this._times = 0
    }

    setUp(PixiApp){
        this._gameapp = PixiApp
        this.addTo(this._gameapp?.mainContainer)
    }

    async _waitingToch(){
        let touchToStartimg = await this._loader.load('./Assets/common/Common_TouchScreenText.png')
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

        //video 
        let ratio = (GameApp.appSize.height / 1080)
        let texture = PIXI.Texture.from(`./Assets/movie/${movie}`);
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
            let soundurl = `./Assets/audio/${hero.toString().padStart(3, '0')}/Showing_${hero.toString().padStart(3, '0')}_${id.toString().padStart(2, '0')}${posit.toString().padStart(2, '0')}/anime_${hero.toString().padStart(2, '0')}_${id.toString().padStart(2, '0')}${posit.toString().padStart(2, '0')}_${clip.clipid}.mp3`
            // PIXI.sound.add(`${clip.charid}_${clip.clipid}`, soundurl)
            const sound = await PIXI.sound.Sound.from({
                url: soundurl,
                preload: true,
                loaded: function() {
                    console.log('Sound loaded');
                }
            });

            this._audio.push({
                delayTime : clip.Time,
                // clipid : `${clip.charid}_${clip.clipid}`
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
        
        controller.play()
        this._gameapp.Ticker.add((delta) => this.update(delta))
        // console.log(controller)
        // controller.ontimeupdate = () => {
        //     this._times = controller.currentTime
        //     this._audio.forEach((clip, index, obj) => {
        //         if(this._times > (clip.delayTime / 1000)){
        //             PIXI.sound.play(clip.clipid)
        //             obj.splice(index, 1);
        //         }
        //     });
        // }
        controller.onended = ()=>{
            this._container.removeChild(this._videoSprit);
            this._container.visible = false
            this._gameapp.Ticker.remove((delta) => this.update(delta))
            this._times = 0
        }

    }

    update(delta){
        this._times += (1 / 60) * delta;
        this._audio.forEach((clip, index, obj) => {
            if(this._times > (clip.delayTime / 1000)){
                // PIXI.sound.play(clip.clipid)
                clip.clip.play()
                obj.splice(index, 1);
                console.log(obj.length)
            }
        });

    }

}

const MoviePlayer = new MoviePlayerClass()
