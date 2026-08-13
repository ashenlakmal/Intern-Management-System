import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  // Gets the active menu name from the parent page (e.g., 'dashboard' or 'projects')
  @Input() activeMenu: string = 'dashboard';

  // Sends an event to the parent page when the sidebar is toggled
  @Output() collapsedChange = new EventEmitter<boolean>();

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.collapsedChange.emit(this.isSidebarCollapsed);
  }
}