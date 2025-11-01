import { Component, OnInit } from "@angular/core";
import { AccordionModule } from "primeng/accordion";
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: "app-dashbord",
  imports: [AccordionModule, HeaderComponent],
  templateUrl: "./dashbord.component.html",
  styleUrl: "./dashbord.component.scss",
})
export class TaskDashbordComponent {}
