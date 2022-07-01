import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData, DatePipe } from '@angular/common';

import localeMX from '@angular/common/locales/es-MX'; //Importa el local para cambiar la fecha a Español-México
registerLocaleData(localeMX, 'es-Mx'); //Registra el local con el nombre a utilizar a la hora de proveer, (es-Mx)

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxMarkjsModule } from 'ngx-markjs';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { QuillModule } from 'ngx-quill';
import { NgRatingBarModule } from 'ng-rating-bar';

//Directives
import { NgDropFilesDirective } from './directives/ng-drop-files.directive';
import { NgDropRequisitoDirective } from './directives/ng-drop-requisito.directive';

import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RedesSocialesComponent } from './components/redes-sociales/redes-sociales.component';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReverseArrayPipe } from './pipes/reverse-array.pipe';
import { NormatecaComponent } from './components/normateca/normateca.component';
import { ViewNoticiaComponent } from './components/noticias/view-noticia/view-noticia.component';
import { ContenidoComponent } from './components/contenido/contenido.component';
import { EstatutosComponent } from './components/estatutos/estatutos.component';
import { ConsejoDirectivoComponent } from './components/consejo-directivo/consejo-directivo.component';
import { AfiliadosComponent } from './components/afiliados/afiliados.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { FormContactoComponent } from './components/contacto/form-contacto/form-contacto.component';
import { MensajePresidenteComponent } from './components/mensaje-presidente/mensaje-presidente.component';
import { ViewAfiliadoComponent } from './components/afiliados/view-afiliado/view-afiliado.component';
import { DatosComponent } from './components/datos/datos.component';
import { MapComponent } from './components/datos/map/map.component';
import { ViewEventoComponent } from './components/agenda/view-evento/view-evento.component';
import { SocialComponent } from './components/social/social.component';
import { ContratarArquitectoComponent } from './components/contratar-arquitecto/contratar-arquitecto.component';
import { TablaArquitectosComponent } from './components/contratar-arquitecto/tabla-arquitectos/tabla-arquitectos.component';
import { ViewArquitectoComponent } from './components/contratar-arquitecto/view-arquitecto/view-arquitecto.component';
import { ViewProyectoComponent } from './components/contratar-arquitecto/view-proyecto/view-proyecto.component';
import { ConveniosComponent } from './components/convenios/convenios.component';
import { SafeHTMLPipe } from './pipes/safe-html.pipe';
import { LogoFlotanteComponent } from './components/logo-flotante/logo-flotante.component';
import { LoginComponent } from './socio/login/login.component';
import { DatosGeneralesComponent } from './socio/datos-generales/datos-generales.component';
import { CertificacionesComponent } from './socio/datos-generales/certificaciones/certificaciones.component';
import { RequisitosComponent } from './socio/datos-generales/requisitos/requisitos.component';
import { FormDatosGeneralesComponent } from './socio/datos-generales/form-datos-generales/form-datos-generales.component';
import { FormOtrosDatosComponent } from './socio/datos-generales/form-otros-datos/form-otros-datos.component';
import { ViewPDFComponent } from './socio/datos-generales/requisitos/view-pdf/view-pdf.component';
import { UploadRequisitoComponent } from './socio/datos-generales/requisitos/upload-requisito/upload-requisito.component';
import { UploadCertificacionComponent } from './socio/datos-generales/certificaciones/upload-certificacion/upload-certificacion.component';
import { ViewCertificacionComponent } from './socio/datos-generales/certificaciones/view-certificacion/view-certificacion.component';
import { ProyectosComponent } from './socio/proyectos/proyectos.component';
import { DeleteFotosComponent } from './socio/proyectos/delete-fotos/delete-fotos.component';
import { DetalleProyectoComponent } from './socio/proyectos/detalle-proyecto/detalle-proyecto.component';
import { FormProyectoOneComponent } from './socio/proyectos/form-proyecto-one/form-proyecto-one.component';
import { FormProyectoTwoComponent } from './socio/proyectos/form-proyecto-two/form-proyecto-two.component';
import { TabsProyectoComponent } from './socio/proyectos/tabs-proyecto/tabs-proyecto.component';
import { UploadFotosComponent } from './socio/proyectos/upload-fotos/upload-fotos.component';
import { SolicitudesComponent } from './socio/solicitudes/solicitudes.component';
import { DetalleSolicitudComponent } from './socio/solicitudes/detalle-solicitud/detalle-solicitud.component';
import { HistorialPagoComponent } from './socio/pagos/historial-pago/historial-pago.component';
import { PagoLineaComponent } from './socio/pagos/pago-linea/pago-linea.component';
import { CambiarContraseniaComponent } from './socio/cambiar-contrasenia/cambiar-contrasenia.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';

// Share Buttons
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { FormCotizacionesComponent } from './socio/cotizaciones/form-cotizaciones/form-cotizaciones.component';
import { CotizacionesComponent } from './socio/cotizaciones/cotizaciones.component';
import { ContactFormComponent } from './components/datos/contact-form/contact-form.component';
import { GoogleAnalyticsService } from './services/google-analytics.service';
import { HistorialCotizacionesComponent } from './socio/cotizaciones/historial-cotizaciones/historial-cotizaciones.component';
import { DetalleCotizacionComponent } from './socio/cotizaciones/historial-cotizaciones/detalle-cotizacion/detalle-cotizacion.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PagoResultComponent } from './socio/pagos/pago-result/pago-result.component';
import { PatrocinadoresComponent } from './components/patrocinadores/patrocinadores.component';
import { ListadoComponent } from './components/patrocinadores/listado/listado.component';
import { ViewPatrocinadorComponent } from './components/patrocinadores/view-patrocinador/view-patrocinador.component';
import { FormDatosGeneralesPatronsComponent } from './socio/datos-generales/form-datos-generales-patrons/form-datos-generales-patrons.component';
import { TabsEditarPatronComponent } from './components/patrocinadores/tabs-editar-patron/tabs-editar-patron.component';
import { TDatosGeneralesComponent } from './components/patrocinadores/t-datos-generales/t-datos-generales.component';
import { TSubirFotosComponent } from './components/patrocinadores/t-subir-fotos/t-subir-fotos.component';
import { TEditarFotosComponent } from './components/patrocinadores/t-editar-fotos/t-editar-fotos.component';
import { TLogoComponent } from './components/patrocinadores/t-logo/t-logo.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { ViewCursoComponent } from './components/cursos/view-curso/view-curso.component';
import { RegistroCursoComponent } from './components/cursos/registro-curso/registro-curso.component';
import { TerminosCondicionesComponent } from './socio/pagos/terminos-condiciones/terminos-condiciones.component';
import { EditarCotizacionComponent } from './socio/cotizaciones/historial-cotizaciones/editar-cotizacion/editar-cotizacion.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    RedesSocialesComponent,
    NoticiasComponent,
    FooterComponent,
    ReverseArrayPipe,
    NormatecaComponent,
    ViewNoticiaComponent,
    ContenidoComponent,
    EstatutosComponent,
    ConsejoDirectivoComponent,
    AfiliadosComponent,
    ContactoComponent,
    AgendaComponent,
    FormContactoComponent,
    MensajePresidenteComponent,
    ViewAfiliadoComponent,
    DatosComponent,
    MapComponent,
    ViewEventoComponent,
    SocialComponent,
    ContratarArquitectoComponent,
    TablaArquitectosComponent,
    ViewArquitectoComponent,
    ViewProyectoComponent,
    ConveniosComponent,
    SafeHTMLPipe,
    LogoFlotanteComponent,
    LoginComponent,
    DatosGeneralesComponent,
    CertificacionesComponent,
    RequisitosComponent,
    FormDatosGeneralesComponent,
    FormOtrosDatosComponent,
    ViewPDFComponent,
    UploadRequisitoComponent,
    NgDropFilesDirective,
    NgDropRequisitoDirective,
    UploadCertificacionComponent,
    ViewCertificacionComponent,
    ProyectosComponent,
    DeleteFotosComponent,
    DetalleProyectoComponent,
    FormProyectoOneComponent,
    FormProyectoTwoComponent,
    TabsProyectoComponent,
    UploadFotosComponent,
    SolicitudesComponent,
    DetalleSolicitudComponent,
    HistorialPagoComponent,
    PagoLineaComponent,
    CambiarContraseniaComponent,
    BusquedaComponent,
    FormCotizacionesComponent,
    CotizacionesComponent,
    ContactFormComponent,
    HistorialCotizacionesComponent,
    DetalleCotizacionComponent,
    NotFoundComponent,
    PagoResultComponent,
    PatrocinadoresComponent,
    ListadoComponent,
    ViewPatrocinadorComponent,
    FormDatosGeneralesPatronsComponent,
    TabsEditarPatronComponent,
    TDatosGeneralesComponent,
    TSubirFotosComponent,
    TEditarFotosComponent,
    TLogoComponent,
    CursosComponent,
    ViewCursoComponent,
    RegistroCursoComponent,
    TerminosCondicionesComponent,
    EditarCotizacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatCarouselModule.forRoot(),
    NgxMarkjsModule,
    PdfViewerModule,
    ShareButtonModule,
    ShareIconsModule,
    FontAwesomeModule,
    QuillModule.forRoot(),
    NgRatingBarModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Mx' }, //Para cambiar la fecha a Español-México
    DatePipe,
    GoogleAnalyticsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
