// google-calendar-api.service.ts
import { Injectable } from '@angular/core';
// import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar';
  private readonly API_KEY = 'SUA_API_KEY'; // Obtém no Google Cloud Console
  private readonly CLIENT_ID = 'SEU_CLIENT_ID';

  // constructor(private oauthService: OAuthService) {
  constructor() {
    this.configureOAuth();
  }

  private configureOAuth() {
    // this.oauthService.configure({
    //   issuer: 'https://accounts.google.com',
    //   strictDiscoveryDocumentValidation: false,
    //   clientId: this.CLIENT_ID,
    //   scope: this.SCOPES,
    //   redirectUri: window.location.origin + '/oauth2/callback',
    // });
  }

  async connect(): Promise<boolean> {
    try {
      // await this.oauthService.loadDiscoveryDocumentAndTryLogin();

      // if (!this.oauthService.hasValidAccessToken()) {
      //   await this.oauthService.initCodeFlow();
      //   return false;
      // }

      return true;
    } catch (error) {
      console.error('Erro ao conectar Google Calendar:', error);
      return false;
    }
  }

  async createEvent(eventData: any): Promise<string> {
    // const accessToken = this.oauthService.getAccessToken();

    const event = {
      summary: eventData.summary,
      description: eventData.description,
      start: {
        dateTime: eventData.start.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: eventData.end.toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      colorId: eventData.colorId || '1',
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 30 },
          { method: 'email', minutes: 1440 }, // 1 dia antes
        ],
      },
    };

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          // Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    const data = await response.json();
    return data.id;
  }

  async updateEvent(eventId: string, eventData: any) {
    // Similar ao createEvent, mas com PUT
  }

  async deleteEvent(eventId: string) {
    // DELETE para remover evento
  }

  disconnect() {
    // this.oauthService.logOut();
  }

  isConnected(): boolean {
    // return this.oauthService.hasValidAccessToken();
    return false
  }
}
