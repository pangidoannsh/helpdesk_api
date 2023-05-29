import { BadGatewayException, Injectable, OnModuleInit } from '@nestjs/common';
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    isJidBroadcast
} from 'baileys-md'
import * as fs from 'fs';
import pino from 'pino';
import { Boom } from '@hapi/boom';

@Injectable()
export class WhatsappService implements OnModuleInit {
    private client: any;

    async onModuleInit() {
        // const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

        this.connectToWhatsApp();
    }

    async connectToWhatsApp() {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

        this.client = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            shouldIgnoreJid: jid => isJidBroadcast(jid),
            logger: pino({ level: 'silent' })
        })
        this.client.ev.on('connection.update', async (update: any) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'close') {
                const reason = new Boom(lastDisconnect.error).output?.statusCode;

                switch (reason) {
                    case DisconnectReason.loggedOut:
                        // Delete Folder Auth Session
                        fs.rmSync('./auth_info_baileys', { recursive: true, force: true })
                        console.log(`Device Logged Out, Please Scan Again.`);
                        // await this.client.logout();
                        // this.connectToWhatsApp(state, saveCreds);
                        break;
                    case DisconnectReason.connectionClosed:
                        console.log("Connection closed, reconnecting....");
                        // this.connectToWhatsApp();
                        break;
                    case DisconnectReason.connectionLost:
                        console.log("Connection Lost, reconnecting....");
                        // this.connectToWhatsApp();
                        break;
                    default:
                        console.log("Connecting...");
                    // this.connectToWhatsApp();
                }
                this.connectToWhatsApp()
            } else if (connection === 'open') {
                console.log(`Whatsapp ${this.client.user.id} Ready!`);
            }

        })

        this.client.ev.on('creds.update', saveCreds);
    }

    async send(phone: string, message: string) {
        const waPhone = phone.substring(1);
        try {
            return await this.client.sendMessage(`62${waPhone}@s.whatsapp.net`, { text: message })
        } catch (e) {
            throw new BadGatewayException(e)
        }
    }

}