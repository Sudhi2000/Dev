import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss']
})
export class UserImageComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  fileAttr = 'Choose File';

  imageChangedEvent: any = '';
  croppedImage: any = '';
  save:boolean=false

  constructor(private dialogRef: MatDialogRef<UserImageComponent>) { }

  ngOnInit(): void {
  }
  //s
  fileChangeEvent(event: any): void {
    
    this.imageChangedEvent = event;
    this.save=true
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

  }

  imageLoaded() {
    /* show cropper */
  
  }

  cropperReady() {
    /* cropper ready */
  
  }

  loadImageFailed() {
    /* show message */
  }


  cancel(){
    this.dialogRef.close()
  }

  submit(){
    const image=this.croppedImage
    this.dialogRef.close(image)



  }

}
