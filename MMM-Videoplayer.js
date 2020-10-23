/* global Module */

/* Magic Mirror 2
 * Module: MMM-Videoplayer
 *
 * By Erik Pettersson
 * Assisted by Timo Pettersson
 * Based on the MMM-videoPlay Module by Sungje KIM
 *
 * MIT Licensed.
 */
Module.register("MMM-Videoplayer", {
	defaults: {
		defaultvideo: "/modules/MMM-Videoplayer/video/mov_bbb.mp4",
		//video: "/modules/MMM-Videoplayer/video/mov_bbb.mp4", // This can also be a link to a mp4 file on the internet.
		//videolist: ["/modules/MMM-Videoplayer/video/test01.mp4", "/modules/MMM-Videoplayer/video/test02.mp4", "/modules/MMM-Videoplayer/video/test03.mp4"], // Can also be links to a mp4 files on the internet.
		random: false, // Play the videos randomly. 
		loop: true, // Repeat the video list.
		showcontorls: false, // Set to true if you want the video controls to show.
		preload: "auto", // Can be set to: "auto", "metadata", "none".
		autoplay: true, // If set to true, sound (muted below) has to be true, otherwise the video will not auto play.
		muted: true, // Mute the sound. If auto play is true, this needs to be true as well, otherwise the video will not auto play.
		pauseonhide: true, // If true the module will pause the video when hidden.
		resumeonshow: true,  // If true the module will resume the video when shown.
		notification: "VIDEOPLAYER1", // Unique notification string for this player.
	},

	// Loading the CSS
	getStyles: function () {
		return ["MMM-Videoplayer.css"];
	},

	// Pause, play, replay and next video control via notifications using "TOGGLE", "REPLAY" or "NEXT".
	notificationReceived: function (notification, payload, sender) {
		if (notification === this.config.notification) {
			if (payload === 'TOGGLE') {
				if (this.video.paused) {
					this.video.play();
				} else {
					this.video.pause();
				}
			} else if (payload === 'NEXT') {
				this.nextVideo();
			} else if (payload === 'REPLAY') {
				this.replayVideo();
			}
		}
	},

	// What happens when the module is hidden.
	suspend: function () {
		if (this.config.pauseonhide) {
			this.video.pause();
		}
	},

	// What happens when the module is shown.
	resume: function () {
		if (this.config.resumeonshow) {
			this.video.play();
		}
	},

	// Restart current playing video from start.
	replayVideo: function () {
		var lastIndex = this.playedVideoArray.length - 1;
		if (lastIndex > -1) {
			this.video.setAttribute("src", this.playedVideoArray[lastIndex]);
			this.video.load();
			this.video.play();
		}
	},

	// Plays the next video in queue.
	nextVideo: function () {
		// Resets the video queue if set to loop.
		if (this.videoArray.length == 0) {
			if (!this.config.loop) {
				return;
			}
			this.videoArray = this.playedVideoArray;
			this.playedVideoArray = [];
		}

		// Random video.
		if (this.config.random) {
			this.currentVideoIndex = Math.floor(Math.random() * this.videoArray.length);
		}

		// Sets the video to play.
		this.video.setAttribute("src", this.videoArray[this.currentVideoIndex]);
		// Add the played video to the played queue.
		this.playedVideoArray.push(this.videoArray.splice(this.currentVideoIndex, 1))
		this.video.load();
		this.video.play();
	},

	// Send the module. :)
	getDom: function () {
		// Setup the video array.
		this.videoArray = [];
		this.playedVideoArray = [];

		// Checks if anything is defined in the config (video or videolist).
		if (!this.config.video && !this.config.videolist) {
			// If not, adds the default clip.
			this.videoArray = [this.config.defaultvideo];
		} else {
			// If videolist is defined, adds them to the array.
			if (this.config.videolist) {
				this.videoArray = this.config.videolist
			}
			// If video is defined add that first in the array. 
			if (this.config.video) {
				this.videoArray.unshift(this.config.video)
			}
		}

		var wrapper = document.createElement("div");
		this.video = document.createElement("video");

		this.currentVideoIndex = 0;

		this.video.addEventListener('ended', this.nextVideo.bind(this), false);
		this.video.muted = this.config.muted;
		this.video.autoplay = this.config.autoplay;
		this.video.loop = false;
		this.video.controls = this.config.showcontorls;
		this.video.preload = this.config.preload;
		this.video.id = this.identifier + "_video";
		this.nextVideo();
		wrapper.appendChild(this.video);
		return wrapper;
	},
}
);
