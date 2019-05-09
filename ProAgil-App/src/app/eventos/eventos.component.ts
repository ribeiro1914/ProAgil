import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  /* variavel */
  eventosFiltrados: Evento[];
  eventos: Evento[];
  //evento: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;

  /*propriedade*/
  _filtroLista = '';
  modalRef: BsModalRef;

  constructor(
    private eventoService: EventoService
    ,private modalService: BsModalService
    ) { }
  // execurado antes da interface ser iniciada .. antes do html ficar pronto
  ngOnInit() {
    this.getEventos();
  }

  /* encapsulamento da propriedade */
  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista
      ? this.filtrarEventos(this.filtroLista)
      : this.eventos;
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template)
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }
  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
        console.log(this.eventos);
      },
      error => {
        console.log(error);
      }
    );
  }
}
