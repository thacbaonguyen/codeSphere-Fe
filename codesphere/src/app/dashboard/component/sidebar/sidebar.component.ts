import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: any[] = [];
  userRoles: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getRolesFromToken().subscribe(roles => {
      this.userRoles = roles;
      this.initializeMenu();
    });
  }

  /**
   * title: tên menu
   * roles: chỉ hiển thị ra màn hình đối với những role có trong roles
   * type : -head : thanh hiển thị. -action: các thanh chức năng
   * path: đường dẫn đến trang -> app-routing -> routeGuard -> hiển thị
   * các tài nguyên liên quan đến thành viên thì chỉ admin được truy cập
   * @private
   */
  private initializeMenu() {
    this.menuItems = [
      {
        title: 'Công cụ',
        roles: ['ADMIN', 'MANAGER'],
        type: 'head'
      },
      {
        title: 'Tổng quan',
        icon: 'assessment',
        path: '/codesphere/dashboard/overview',
        roles: ['ADMIN', 'MANAGER'], // cả admin và manager được truy cập
        type: 'action'
      },
      {
        title: 'Nội dung',
        roles: ['ADMIN', 'MANAGER'],
        type: 'head'
      },
      {
        title: 'Thành viên',
        icon: 'people',
        path: '/codesphere/dashboard/member',
        roles: ['ADMIN'], // chỉ admin được truy cập danh sách thành viên
        type: 'action'
      },
      {
        title: 'Bài tập',
        icon: 'library_books',
        path: '/codesphere/dashboard/exercises',
        roles: ['ADMIN', 'MANAGER'], // cả admin và manager được truy cập danh sách bài tập
        type: 'action'
      },
      {
        title: 'Blog',
        icon: 'apps',
        path: '/codesphere/dashboard/blogs', // chỉ admin được truy cập danh sách blog
        roles: ['ADMIN'],
        type: 'action'
      },
      {
        title: 'Sách',
        icon: 'menu_book',
        path: '/codesphere/dashboard/books',
        roles: ['ADMIN', 'MANAGER'], // cả admin và manager được truy cập trang sách
        type: 'action'
      },
      {
        title: 'Khóa học',
        icon: 'play_circle_filled',
        children: [
          { title: 'Danh sách khóa', path: '/codesphere/courses/list' },
          { title: 'Chi tiết khóa', path: '/codesphere/courses/overview' }
        ],
        roles: ['ADMIN', 'MANAGER'],
        type: 'action'
      },
      {
        title: 'Yêu cầu',
        roles: ['ADMIN', 'MANAGER'],
        type: 'head'
      },
      {
        title: 'Quyền',
        icon: 'pan_tool',
        path: '/codesphere/dashboard/permissions',
        roles: ['ADMIN'], // chỉ admin được truy cập danh sách đăng ký quyền
        type: 'action'
      },

      {
        title: 'Đóng góp',
        icon: 'volunteer_activism',
        children: [
          { title: 'Danh sách khóa', path: '/codesphere/dashboard/contributions/accepted' },
          { title: 'Chi tiết khóa', path: '/codesphere/dashboard/contributions/queue' }
        ],
        roles: ['ADMIN', 'MANAGER'], // cả admin và manager được truy cập đóng góp bài ttajp
        type: 'action'
      },
      {
        title: 'Phân quyền',
        roles: ['ADMIN'],
        type: 'head'
      },
      {
        title: 'Manager',
        icon: 'person',
        path: '/codesphere/dashboard/manager-members',
        roles: ['ADMIN'], // chỉ admin được truy cập danh sách manager
        type: 'action'
      },
      {
        title: 'Blogger',
        icon: 'edit',
        path: '/codesphere/dashboard/blogger-member',
        roles: ['ADMIN'], // chỉ admin được truy cập danh sách blogger
        type: 'action'
      },
      {
        title: 'Danh sách khóa',
        icon: 'lock_person',
        path: '/codesphere/dashboard/block-lists',
        roles: ['ADMIN'], // chỉ admin được truy cập danh sách bị khóa
        type: 'action'
      },

    ];
  }

  hasAccess(item: any): boolean {
    return item.roles ? item.roles.some((role: string) => this.userRoles.includes(role)) : true;
  }

}
