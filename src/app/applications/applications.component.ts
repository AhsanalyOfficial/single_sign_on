import { Component, inject, ViewChild } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent {
  /////////////////////////////////////////////////////////////////////////////////////////////
  displayedColumns: string[] = [
    'select',
    'appId',
    'applicationName',
    'applicationType',
    'clientId',
    'secretId',
    'setting',
  ];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  applicationForm: any = FormGroup;
  searchKey: string = '';
  readonly dialog = inject(MatDialog);

  loading: any = this.service.loading.asObservable();
  constructor(private service: ApplicationService, private fb: FormBuilder) {
    this.applicationForm = this.fb.group({
      applicationId: [''],
      name: [''],
      applicationType: [''],
      clientId: [''],
      clientSecret: [''],
    });
  }
  ngOnInit() {
    this.loadingApplications();
    this.service.applications.subscribe((app) => (this.dataSource.data = app));
  }
  loadingApplications() {
    this.service.getAllApplications();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
      height: 'max-content',
      width: '600px',
      data: { mode: 'add' },
    });
  }
  editOpenDialog(application?: any) {
    console.log('applicationData', application);
    this.dialog.open(DialogComponent, {
      height: 'max-content',
      width: '600px',
      data: { mode: 'edit', application },
    });
  }
  Delete(id: any) {
    this.service.deleteApplication(id);
  }
}
