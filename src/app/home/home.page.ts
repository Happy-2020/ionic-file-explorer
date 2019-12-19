import { Component, OnInit } from '@angular/core';
import { File, Entry } from '@ionic-native/file/ngx';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    directories = [];
    folder = '';
    copyFile: Entry = null;
    shouldMove = false;

    constructor(
        private file: File,
        private plt: Platform,
        private alertCtrl: AlertController,
        private fileOpener: FileOpener,
        private router: Router,
        private route: ActivatedRoute,
        private toastCtrl: ToastController
    ) {}

    ngOnInit()
    {
        this.folder = this.route.snapshot.paramMap.get('folder') || '';
        this.loadDocuments();
    }

    loadDocuments()
    {
        this.plt.ready().then(() => {
            // Reset for later copy / move operations
            this.copyFile = null;
            this.shouldMove = false;

            this.file.listDir(this.file.dataDirectory, this.folder).then(res => {
                this.directories = res;
            });
        });
    }

    async createFolder()
    {
        let alert = await this.alertCtrl.create({
            header: 'Create folder',
            message: 'Please specify the name of the new folder',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'MyDir'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: 'Create',
                    handler: data => {
                        this.file.createDir(
                            `${this.file.dataDirectory}/${this.folder}`,
                            data.name,
                            false
                        ).then(res => {
                            this.loadDocuments();
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

    async createFile()
    {
        let alert = await this.alertCtrl.create({
            header: 'Create file',
            message: 'Please specify the name of the new file',
            inputs: [
                {
                    name: 'name',
                    type: 'text',
                    placeholder: 'MyFile'
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    cssClass: 'secondary'
                },
                {
                    text: 'Create',
                    handler: data => {
                        this.file.writeFile(
                            `${this.file.dataDirectory}/${this.folder}`,
                            `${data.name}.txt`,
                            `My custom text - ${new Date().getTime()}`
                        ).then(res => {
                            this.loadDocuments();
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

}
