import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private http: HttpClient) {
    this.getAllApplications();
  }
  private applicationSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  public applications: Observable<any> = this.applicationSubject.asObservable();
  public loading = new BehaviorSubject<boolean>(false);
  // https://api.sso.id/swagger/index.html#/
  // https://localhost:44326/swagger
  private baseApi = 'https://api.sso.id';
  async getAllApplications() {
    try {
      this.loading.next(true);
      const applicationData: any = await lastValueFrom(this.getApplications());
      this.applicationSubject.next(applicationData);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      this.loading.next(false);
    }
  }
  public getApplications(): any {
    return this.http.get(`${this.baseApi}/applications`);
  }
  public async addApplication(applicationData: any) {
    const add = this.http.post(`${this.baseApi}/application`, applicationData);
    const newApplication = await lastValueFrom(add);
    this.pushApplication(newApplication);
  }
  public async deleteApplication(id: any) {
    this.loading.next(true);
    try {
      const deleteData = this.http.delete(`${this.baseApi}/application/${id}`);
      await lastValueFrom(deleteData);
      this.DeleteApplication(id);
    } catch (error) {
      console.error('Error deleting application:', error);
    } finally {
      this.loading.next(false);
    }
  }
  async updateApplication(id: string, applicationData: any) {
    try {
      const update = this.http.put(
        `${this.baseApi}/application/${id}`,
        applicationData
      );
      await lastValueFrom(update);
      this.EditApplication(applicationData);
    } catch (error) {
      console.error('Error updating application:', error);
    } finally {
      this.loading.next(false);
    }
  }
  private pushApplication(applicationData: any) {
    const currentData = this.applicationSubject.getValue();
    this.applicationSubject.next([...currentData, applicationData]);
  }
  private DeleteApplication(id: any): void {
    const currentData = this.applicationSubject.getValue();
    const updateData = currentData.filter(
      (data: { applicationId: any }) => data.applicationId !== id
    );
    this.applicationSubject.next(updateData);
  }
  private EditApplication(updateApplication: any): void {
    const currentData = this.applicationSubject.getValue();
    const updateData = currentData.map((application: { applicationId: any }) =>
      application.applicationId === application.applicationId
        ? updateApplication
        : application
    );
    this.applicationSubject.next(updateData);
  }
}
