export default class VideoPopup {
    constructor(thumbnailSelector, popupSelector, videoSelector, closeBtnSelector, videoUrl) {
      this.thumbnail = document.querySelector(thumbnailSelector);
      this.popup = document.querySelector(popupSelector);
      this.video = document.querySelector(videoSelector);
      this.closeBtn = document.querySelector(closeBtnSelector);
      this.videoUrl = videoUrl;
  
      this.handleThumbnailClick = this.handleThumbnailClick.bind(this);
      this.handleCloseClick = this.handleCloseClick.bind(this);
    }
  
    init() {
      if (this.thumbnail && this.popup && this.video && this.closeBtn) {
        this.thumbnail.addEventListener('click', this.handleThumbnailClick);
        this.closeBtn.addEventListener('click', this.handleCloseClick);
      } else {
      }
    }
  
    handleThumbnailClick() {
      this.video.querySelector('source').src = this.videoUrl;
      this.video.load(); // Atualiza o vídeo
      this.video.play(); // Começa o vídeo após abrir
      this.popup.style.display = 'flex';
    }
  
    handleCloseClick() {
      this.video.pause();
      this.video.currentTime = 0;
      this.popup.style.display = 'none';
      this.video.querySelector('source').src = '';
      this.video.load();
    }
  }
  