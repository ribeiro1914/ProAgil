import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  /* variavel */
  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  
  /*propriedade*/
  _filtroLista = '';
  registerForm: FormGroup;
  
  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService
    ) {
      this.localeService.use('pt-br');
    }
    
    //#region metodos iniciais
    // execurado antes da interface ser iniciada .. antes do html ficar pronto
    openModal(template: any) {
      this.registerForm.reset();
      template.show();
    }

    ngOnInit() {
      this.validation();
      this.getEventos();
    }
    //#endregion
    
    //#region CRUD
    novoEvento(template: any) {
      this.modoSalvar = 'post';
      this.openModal(template);
    }
    
    editarEvento(evento: Evento, template: any) {
      this.modoSalvar = 'put';
      this.openModal(template);
      this.evento = evento;
      this.registerForm.patchValue(evento);
    }

    excluirEvento(evento: Evento, template: any) {
      this.openModal(template);
      this.evento = evento;
      this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.eventoId}`;
    }

   

    //#endregion
    
    //#region Filtros
    /* encapsulamento da propriedade */
    get filtroLista(): string {
      return this._filtroLista;
    }
    
    set filtroLista(value: string) {
      this._filtroLista = value;
      this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
    }
    
    filtrarEventos(filtrarPor: string): Evento[] {
      filtrarPor = filtrarPor.toLocaleLowerCase();
      return this.eventos.filter(
        evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
        );
      }
      //#endregion
      
      //#region Salvar e Confirma Delete
      
      salvarAlteracao(template: any) {
        if (this.registerForm.valid) {
          if (this.modoSalvar === 'post') {
            this.evento = Object.assign({}, this.registerForm.value);
            this.eventoService.postEvento(this.evento).subscribe(
              () => {
                template.hide();
                this.getEventos();
              },
              error => {
                console.log(error);
              }
              );
            } else {
              this.evento = Object.assign({eventoId: this.evento.eventoId}, this.registerForm.value);
              this.eventoService.putEvento(this.evento).subscribe(
                () => {
                  template.hide();
                  this.getEventos();
                },
                error => {
                  console.log(error);
                }
                );
              }
            }
          }

          confirmeDelete(template: any) {
            this.eventoService.deleteEvento(this.evento.eventoId).subscribe(
              () => {
                  template.hide();
                  this.getEventos();
                }, error => {
                  console.log(error);
                }
            );
          }

          //#endregion
          
          //#region Validar
          validation() {
            this.registerForm = this.fb.group({
              tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
              local: ['', Validators.required],
              dataEvento: ['', [Validators.required, Validators.max(20000)]],
              qtdPessoas: ['', Validators.required],
              imagemURL: ['', Validators.required],
              telefone: ['', Validators.required],
              email: ['', [Validators.required, Validators.email]],
            });
          }
          //#endregion
          
          //#region Metodo Get e alternar imagem
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
          //#endregion
          