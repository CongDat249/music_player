const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlistEl = $(".playlist");
const thumb = $(".song-thumbnail img");
const playBtn = $(".btn-toggle-play");
const playIcon = $(".icon-play");
const audio = $(".audio");
const progress = $(".slider")
const nextBtn = $(".btn-next")
const prevBtn = $(".btn-prev")
const repeatBtn = $(".btn-repeat")
const shuffleBtn = $(".btn-shuffle")
const loveBtn = $(".icon-heart");

function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.ceil(seconds % 60);
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;
    return [min, sec];
}

const app = {
    isPlaying: false,
    currentIndex: 0,
    config: {
        isRandom: false,
        isLoop: false,
        currentIndex: 0
    },
    songs: [
        {
            title: "Peru",
            artist: "Ed Sheeran",
            audio: "assets/music/song0.mp3",
            thumbnail: "assets/images/song0.png" 
        },
        {
            title: "ALA You Love Me",
            artist: "Wretch 32, Ed Sheeran",
            audio: "assets/music/song1.mp3",
            thumbnail: "assets/images/song1.png" 
        },
        {
            title: "Hush Little Baby",
            artist: "Wretch 32, Ed Sheeran",
            audio: "assets/music/song2.mp3",
            thumbnail: "assets/images/song2.png" 
        },
        {
            title: "We Dont Talk Anymore",
            artist: "Feat. Selena Gomez - Charlie Puth",
            audio: "assets/music/song3.mp3",
            thumbnail: "assets/images/song3.png" 
        },
        {
            title: "I Cant Spell Lyricsn",
            artist: "Ed Sheeran",
            audio: "assets/music/song4.mp3",
            thumbnail: "assets/images/song4.png" 
        },
        {
            title: "Photograph",
            artist: "Ed Sheeran",
            audio: "assets/music/song5.mp3",
            thumbnail: "assets/images/song5.png" 
        },
        {
            title: "Shape Of You",
            artist: "Ed Sheeran",
            audio: "assets/music/song6.mp3",
            thumbnail: "assets/images/song6.png" 
        },
        {
            title: "Easy On Me",
            artist: "Adele",
            audio: "assets/music/song7.mp3",
            thumbnail: "assets/images/song7.png" 
        },
        {
            title: "Sweet Dreams",
            artist: "Alan Walker, Imanbek",
            audio: "assets/music/song8.mp3",
            thumbnail: "assets/images/song8.png" 
        },
        {
            title: "Watermelon Sugar",
            artist: "Harry Styles",
            audio: "assets/music/song9.mp3",
            thumbnail: "assets/images/song9.png" 
        },
        {
            title: "Perfect",
            artist: "Ed Sheeran",
            audio: "assets/music/song10.mp3",
            thumbnail: "assets/images/song10.png" 
        }
    ],

    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    renderPlaylist() {
        let htmls = this.songs.map((song, index) => 
            `<div class="playlist-song  ${this.currentIndex == index ? "active": ""}" onclick="app.playSong(${index})" data-index=${index}>
                <img class="playlist-song-img" src="${song.thumbnail}" alt="song1">
                <div class="playlist-info">
                    <h5 class="playlist-song-title">${song.title}</h5>
                    <p class="playlist-song-artist">${song.artist}</p>
                </div>
                <i class="fas fa-ellipsis-h"></i>
            </div>`
        )
        playlistEl.innerHTML = htmls.join('');
    },

    loadUserConfig() {
        const history = JSON.parse(localStorage.getItem('USER_CONFIG'))
        if (!history) {
            this.updateLocalStorage();
        }
        else this.config = history;

        this.currentIndex = Number(this.config.currentIndex);
        if (this.config.isLoop) {
            repeatBtn.classList.add('active');
        }
        if (this.config.isRandom) {
            shuffleBtn.classList.add('active')
        }
    },

    updateLocalStorage() {
        this.config.currentIndex = this.currentIndex;
        localStorage.setItem('USER_CONFIG', JSON.stringify(app.config))
    },

    loadCurentSong() {
        const titleEl = $(".song-title")
        const artistEl = $(".song-artist")
        const thumbEl = $(".song-thumbnail img")
        const audioEl = $(".audio")
        
        let {title, artist, thumbnail, audio} = this.currentSong

        titleEl.textContent = title;
        artistEl.textContent = artist;
        thumbEl.src = thumbnail;
        audioEl.src = audio;
        progress.value = 0;
    },

    updateTime() {
        const timePlayed = audio.currentTime;
        const timeLeft = audio.duration - timePlayed;
        let [min, sec] = formatTime(timePlayed);
        $(".time-played").textContent = `${min}:${sec}`;
        let [minLeft, secLeft] = formatTime(timeLeft);
        $(".time-left").textContent = `${minLeft}:${secLeft}`;
        let position = audio.currentTime / audio.duration * 100;
        progress.value = isNaN(position) ? 0 : position;
    },

    playSong(index) {
        this.currentIndex = index;
        this.loadCurentSong();
        audio.play();
    },

    nextSong() {
        this.currentIndex = (this.currentIndex + 1) % (this.songs.length);
        audio.currentTime = 0;
        progress.value = 0;
        this.loadCurentSong();
        audio.play();
    },

    prevSong() {
        if (this.currentIndex == 0) {
            this.currentIndex = this.songs.length;
        }
        this.currentIndex = (this.currentIndex - 1);
        this.loadCurentSong();
        audio.currentTime = 0;
        progress.value = 0;
        audio.play();
    },

    handleEvents() {
        const _this = this;
        const thumbWidth = thumb.offsetWidth;
        const plHeight = playlistEl.offsetHeight;
        const maxPlHeight = 390;

        // Handle rotate thumb
        const thumbAnimate = thumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        thumbAnimate.pause();

        playlistEl.onscroll = function() {
            let scrollTop = playlistEl.scrollTop;
            let size = thumbWidth - scrollTop < 0 ? 0 : thumbWidth - scrollTop;
            let newPlHeight = Math.min(plHeight + scrollTop, maxPlHeight);
            thumb.style.width = size + "px";
            thumb.style.height = size + "px";
            playlistEl.style.height = newPlHeight + "px";
        }

        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
                thumbAnimate.pause();
            }
            else {
                audio.play();
                thumbAnimate.play();
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            playIcon.classList.remove("fa-play")
            playIcon.classList.add("fa-pause")
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            playIcon.classList.remove("fa-pause")
            playIcon.classList.add("fa-play")
        }

        audio.ontimeupdate = function() {
            _this.updateTime();
        }

        audio.onended = function() {
            if (_this.config.isRandom && !_this.config.isLoop) {
                let randomNumber;
                do {
                    randomNumber = Math.floor(Math.random()*_this.songs.length)
                } while (randomNumber == _this.currentIndex);
                _this.currentIndex = randomNumber;
                _this.loadCurentSong();
                audio.play();
            }
            else if (!_this.config.isLoop) _this.nextSong();
            else {
                audio.loop = _this.config.isLoop;
                audio.currentTime = 0;
                audio.play();
            }
        }

        audio.ondurationchange = function() {
            $('.playlist-song.active').classList.remove('active');
            $(`.playlist-song[data-index="${_this.currentIndex}"]`).classList.add("active");
            _this.updateLocalStorage();
            playlistEl.onscroll = function(){}
            playlistEl.scrollTop = _this.currentIndex * 50;
            // Update start and end time
            _this.updateTime();
        }

        progress.oninput = function() {
            let seekTime = (audio.duration / 100 ) * progress.value;
            audio.currentTime = seekTime;
        }

        nextBtn.onclick = function() {
            _this.nextSong();
        }

        prevBtn.onclick = function() {
            _this.prevSong();
        }

        repeatBtn.onclick = function() {
            repeatBtn.classList.toggle("active");
            _this.config.isLoop = !_this.config.isLoop;
            audio.loop = _this.config.isLoop;
            _this.updateLocalStorage();
        }

        shuffleBtn.onclick = function() {
            shuffleBtn.classList.toggle("active");
            _this.config.isRandom = !_this.config.isRandom;
            _this.updateLocalStorage();
        }

        loveBtn.onclick = function() {
            this.classList.toggle('fas');
        }
    },
    start() {
        this.defineProperties();
        this.loadUserConfig();
        this.renderPlaylist();
        this.loadCurentSong();
        this.handleEvents();
    }
}

app.start();