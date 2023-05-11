import { Injectable, OnModuleInit } from '@nestjs/common';
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    isJidBroadcast,
    AuthenticationState,
    UserFacingSocketConfig
} from 'baileys-md'
import * as fs from 'fs';
import pino from 'pino';
import { Boom } from '@hapi/boom';

@Injectable()
export class WhatsappService implements OnModuleInit {
    private client: any;

    async onModuleInit() {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

        this.connectToWhatsApp(state, saveCreds);
    }

    async connectToWhatsApp(state: AuthenticationState, saveCreds: () => void) {

        this.client = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            shouldIgnoreJid: jid => isJidBroadcast(jid),
            logger: pino({ level: 'silent' })
        })
        this.client.ev.on('connection.update', async (update: any) => {
            const { connection, lastDisconnect } = update;

            // connection === 'connecting' ? console.log(connection + ' Whatsapp API...') : ''

            if (connection === 'close') {
                const reason = new Boom(lastDisconnect.error).output?.statusCode;

                switch (reason) {
                    case DisconnectReason.loggedOut:
                        // Delete Folder Auth Session
                        fs.rmSync('./auth_info_baileys', { recursive: true, force: true })
                        console.log(`Device Logged Out, Please Scan Again.`);
                        this.client.logout();
                        this.connectToWhatsApp(state, saveCreds);
                        break;
                    case DisconnectReason.connectionClosed:
                        console.log("Connection closed, reconnecting....");
                        this.connectToWhatsApp(state, saveCreds);
                        break;
                    case DisconnectReason.connectionLost:
                        console.log("Connection Lost, reconnecting....");
                        this.connectToWhatsApp(state, saveCreds);
                        break;
                    default:
                        console.log('default state');
                        this.connectToWhatsApp(state, saveCreds);
                }
            } else if (connection === 'open') {
                console.log(`Whatsapp ${this.client.user.id} Ready!`);
                // console.log(this.client);

            }

        })

        this.client.ev.on('creds.update', saveCreds);
    }

    async send(phone: string, message: string) {
        const waPhone = phone.substring(1);
        try {
            return await this.client.sendMessage(`62${waPhone}@s.whatsapp.net`, { text: message })
        } catch (e) {
            console.log('(Catch) Failed sending to ' + phone);
            console.log(e);

            return {
                status: false,
                response: e,
            }
        }
    }

}