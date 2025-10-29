import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewModalComponent, ViewSection } from './view-modal.component';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal.component';
import { ModalService, ViewModalConfig, DeleteModalConfig } from '../../services/modal.service';

@Component({
  selector: 'app-global-modals',
  standalone: true,
  imports: [CommonModule, ViewModalComponent, DeleteConfirmationModalComponent],
  template: `
    <!-- View Modal -->
    <app-view-modal
      [visible]="viewModalVisible"
      [title]="viewModalConfig?.title || ''"
      [subtitle]="viewModalConfig?.subtitle"
      [headerIcon]="viewModalConfig?.headerIcon || 'pi pi-eye'"
      [headerColor]="viewModalConfig?.headerColor || 'rgba(255, 255, 255, 0.2)'"
      [sections]="viewModalConfig?.sections || []"
      (onClose)="onViewModalClose()"
      (onEdit)="onViewModalEdit()"
      (onDelete)="onViewModalDelete()"
    ></app-view-modal>

    <!-- Delete Confirmation Modal -->
    <app-delete-confirmation-modal
      [visible]="deleteModalVisible"
      [title]="deleteModalConfig?.title || '¿Estás seguro?'"
      [message]="deleteModalConfig?.message || ''"
      [itemName]="deleteModalConfig?.itemName"
      [itemLabel]="deleteModalConfig?.itemLabel || ''"
      [showWarning]="deleteModalConfig?.showWarning !== false"
      [warningMessage]="deleteModalConfig?.warningMessage || ''"
      [isDeleting]="deleteModalLoading"
      (onConfirm)="onDeleteConfirm()"
      (onCancel)="onDeleteCancel()"
    ></app-delete-confirmation-modal>
  `
})
export class GlobalModalsComponent implements OnInit {
  viewModalVisible = false;
  viewModalConfig: ViewModalConfig | null = null;
  
  deleteModalVisible = false;
  deleteModalConfig: DeleteModalConfig | null = null;
  deleteModalLoading = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Subscribe to view modal state
    this.modalService.viewModalVisible$.subscribe(visible => {
      this.viewModalVisible = visible;
    });

    this.modalService.viewModalConfig$.subscribe(config => {
      this.viewModalConfig = config;
    });

    // Subscribe to delete modal state
    this.modalService.deleteModalVisible$.subscribe(visible => {
      this.deleteModalVisible = visible;
    });

    this.modalService.deleteModalConfig$.subscribe(config => {
      this.deleteModalConfig = config;
    });

    this.modalService.deleteModalLoading$.subscribe(loading => {
      this.deleteModalLoading = loading;
    });
  }

  onViewModalClose(): void {
    this.modalService.closeViewModal();
  }

  onViewModalEdit(): void {
    this.modalService.handleViewModalEdit();
  }

  onViewModalDelete(): void {
    this.modalService.handleViewModalDelete();
  }

  onDeleteConfirm(): void {
    this.modalService.handleDeleteConfirm();
  }

  onDeleteCancel(): void {
    this.modalService.closeDeleteModal();
  }
}
