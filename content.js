console.log("content.js");

var recorder = null;

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);
  recorder.start();
  console.log("recorder started");

  recorder.onstop = (e) => {
    stream.getTracks().forEach((track) => {
      // track.stop();
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };
  recorder.ondataavailable = (e) => {
    // let blob = new Blob([e.data], { type: "video/webm" });]
    let recordedBlob = e.data;
    let url = URL.createObjectURL(recordedBlob);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "screen_recording.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("data available");
  };
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "record_video") {
    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          width: 9999999999,
          height: 9999999999,
        },
        audio: true,
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (request.message === "stop_video") {
    console.log("stopping video");
    sendResponse({ message: "video_stopped" });
    if (recorder) {
      recorder.stop();
    }
  }
});
