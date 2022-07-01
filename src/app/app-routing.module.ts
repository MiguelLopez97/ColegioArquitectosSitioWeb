import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { NormatecaComponent } from './components/normateca/normateca.component';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { ViewNoticiaComponent } from './components/noticias/view-noticia/view-noticia.component';
import { ContenidoComponent } from './components/contenido/contenido.component';
import { AfiliadosComponent } from './components/afiliados/afiliados.component';
import { ConsejoDirectivoComponent } from './components/consejo-directivo/consejo-directivo.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { EstatutosComponent } from './components/estatutos/estatutos.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { ViewCursoComponent } from './components/cursos/view-curso/view-curso.component';
import { RegistroCursoComponent } from './components/cursos/registro-curso/registro-curso.component';
import { MensajePresidenteComponent } from './components/mensaje-presidente/mensaje-presidente.component';
import { ViewAfiliadoComponent } from './components/afiliados/view-afiliado/view-afiliado.component';
import { DatosComponent } from './components/datos/datos.component';
import { ViewEventoComponent } from './components/agenda/view-evento/view-evento.component';
import { SocialComponent } from './components/social/social.component';
import { ContratarArquitectoComponent } from './components/contratar-arquitecto/contratar-arquitecto.component';
import { ViewArquitectoComponent } from './components/contratar-arquitecto/view-arquitecto/view-arquitecto.component';
import { ViewProyectoComponent } from './components/contratar-arquitecto/view-proyecto/view-proyecto.component';
import { ConveniosComponent } from './components/convenios/convenios.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './socio/login/login.component';

//Componentes para las rutas de 'Socio'
import { DatosGeneralesComponent } from './socio/datos-generales/datos-generales.component';
import { ProyectosComponent } from './socio/proyectos/proyectos.component';
import { DetalleProyectoComponent } from './socio/proyectos/detalle-proyecto/detalle-proyecto.component';
import { SolicitudesComponent } from './socio/solicitudes/solicitudes.component';
import { PagoLineaComponent } from './socio/pagos/pago-linea/pago-linea.component';
import { PagoResultComponent } from './socio/pagos/pago-result/pago-result.component';
import { HistorialPagoComponent } from './socio/pagos/historial-pago/historial-pago.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { CotizacionesComponent } from './socio/cotizaciones/cotizaciones.component';
import { DetalleCotizacionComponent } from './socio/cotizaciones/historial-cotizaciones/detalle-cotizacion/detalle-cotizacion.component';
import { PatrocinadoresComponent } from './components/patrocinadores/patrocinadores.component';
import { ListadoComponent } from './components/patrocinadores/listado/listado.component';
import { ViewPatrocinadorComponent } from './components/patrocinadores/view-patrocinador/view-patrocinador.component';
import { EditarCotizacionComponent } from './socio/cotizaciones/historial-cotizaciones/editar-cotizacion/editar-cotizacion.component';

const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'noticias/noticia/:idNoticia', component: ViewNoticiaComponent },
  { path: 'normateca', component: NormatecaComponent },
  { path: 'contenido', component: ContenidoComponent }, // Conocenos
  { path: 'afiliados', component: AfiliadosComponent },
  { path: 'afiliados/afiliado/:idAfiliado', component: ViewAfiliadoComponent },
  { path: 'consejo-directivo', component: ConsejoDirectivoComponent },
  { path: 'afiliar', component: ContactoComponent }, // Afiliate en línea
  { path: 'estatutos', component: EstatutosComponent },
  { path: 'agenda', component: AgendaComponent },
  { path: 'agenda/evento/:idEvento', component: ViewEventoComponent },
  { path: 'cursos', component: CursosComponent },
  { path: 'cursos/:idCurso', component: ViewCursoComponent },
  { path: 'cursos/:idCurso/registro', component: RegistroCursoComponent },
  { path: 'mensaje-presidente', component: MensajePresidenteComponent },
  { path: 'contacto', component: DatosComponent }, // Contacto
  { path: 'redes-sociales', component: SocialComponent },
  { path: 'contratar-arquitecto', component: ContratarArquitectoComponent },
  {
    path: 'contratar-arquitecto/arquitecto/:idSocio',
    component: ViewArquitectoComponent,
  },
  {
    path: 'contratar-arquitecto/arquitecto/:idSocio/proyecto/:idProyecto',
    component: ViewProyectoComponent,
  },
  { path: 'convenios', component: ConveniosComponent },
  { path: 'patrocinadores', component: PatrocinadoresComponent },
  { path: 'patrocinadores/list', component: ListadoComponent },
  { path: 'patrocinadores/:id', component: ViewPatrocinadorComponent },
  {
    path: 'busqueda/:categoria/:criterioBusqueda',
    component: BusquedaComponent,
  },

  //Rutas para 'Socio'
  { path: 'login', component: LoginComponent },
  { path: 'datos-generales', component: DatosGeneralesComponent },
  { path: 'proyectos', component: ProyectosComponent },
  {
    path: 'proyectos/detalle-proyecto/:idProyecto',
    component: DetalleProyectoComponent,
  },
  { path: 'solicitudes', component: SolicitudesComponent },
  { path: 'cotizaciones', component: CotizacionesComponent },
  {
    path: 'cotizaciones/detalle-cotizacion/:idCotizacion',
    component: DetalleCotizacionComponent,
  },
  { path: 'cotizaciones/editar/:idCotizacion', component: EditarCotizacionComponent },
  { path: 'pago-online', component: PagoLineaComponent },
  { path: 'pago-online/:idProducto', component: PagoLineaComponent },
  { path: 'pago-result', component: PagoResultComponent },
  { path: 'historial-pagos', component: HistorialPagoComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
