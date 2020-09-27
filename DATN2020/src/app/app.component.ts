import { Component, OnInit } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Demo';

  listMediaUrls: Array<string> = new Array<string>();
  urlCurrent: string;
  isPlayVideo: boolean = false;
  previewVideo: any;
  intervalList: Array<any> = new Array<any>();
  constructor() { }
  s3: any;
  ngOnInit() {
    this.s3 = new S3({
      accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      endpoint: 'http://localhost:9200',
      s3ForcePathStyle: true, // needed with minio?
      signatureVersion: 'v4'
    });

    this.getListMedia();
    this.urlCurrent = this.listMediaUrls[0];
    // this.previewVideo = document.getElementById("previewVideo") as HTMLVideoElement;
  }

  selectedFiles: FileList;

  upload() {
    const file = this.selectedFiles.item(0);
    this.uploadFile(file);
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  uploadFile(file) {
    const params = {
      Bucket: 'hoai',
      Key: file.name,
      Body: file,
    };
    this.s3.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
      return true;
    });
  }

  getListMedia() {
    const params = {
      Bucket: 'hoai',
    };
    let $this = this;
    this.s3.listObjects(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      const fileDatas = data.Contents;
      fileDatas.forEach((file) => {
        $this.listMediaUrls.push("http://localhost:9200/hoai/" + file.Key);
        $this.count++;
      });
      return true;
    });
  }
  count: number = 0;
  position: number = 0;
  readonly WIDTH = 1380;
  index = 1;
  playVideo() {
    this.isPlayVideo = true;
    if(this.isPlayVideo) {
      let time = setInterval(() => {
        if (this.index == this.listMediaUrls.length) {
          return;
        }
        // this.previewVideo.src = this.listMediaUrls[i];
        this.urlCurrent = this.listMediaUrls[this.index];
        this.index++;
        this.position += this.WIDTH / this.count;
      }, 700);
      this.intervalList.push(time);
    }
  }


  pauseVideo() {
    this.isPlayVideo = false;
    // this.previewVideo.pause();
    this.clearIntervalList();
  }

  /**
   * clear interval list
   */
  public clearIntervalList() {
    if (this.intervalList.length > 0) {
      this.intervalList.forEach(time => {
        clearInterval(time);
      });
    }
    this.intervalList = [];
  }

}
