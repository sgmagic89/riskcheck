import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PlacesType } from 'src/app/models/placesType.model';
import { PlacesService } from 'src/app/services/logicalServices/places.service';
@Component({
  selector: 'app-add-filter',
  templateUrl: './add-filter.component.html',
  styleUrls: ['./add-filter.component.scss'],
})
export class AddFilterComponent implements OnInit {
  filterForm: FormGroup = <FormGroup>{};
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddFilterComponent>,
    private placesService: PlacesService
  ) {}

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      filterName: [null, [Validators.required]],
      filterKeyword: [null, Validators.required],
    });
  }

  submit() {
    if (!this.filterForm.valid) {
      return;
    }
    const placeType = new PlacesType(
      this.filterForm.value.filterName,
      true,
      undefined,
      this.filterForm.value.filterKeyword,
      true
    );
    this.placesService.addPlaceType(placeType);
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }
}
