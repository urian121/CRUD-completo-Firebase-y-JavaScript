    <div class="modal fade" id="agregarEmpleadoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 titulo_modal">Registrar Nuevo Empleado</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formularioEmpleado" action="" method="POST" autocomplete="off">
                        <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input type="text" name="nombre" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Cédula (NIT)</label>
                            <input type="text" name="cedula" class="form-control" />
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="form-label">Seleccione la edad</label>
                                <select class="form-select" name="edad" required>
                                    <option value=""> Seleccione </option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option value="29">29</option>
                                    <option value="30">30</option>
                                </select>
                            </div>

                            <div class="col-md-6">
                                <label class="form-label">Sexo</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="sexo" id="sexo_m" value="Masculino" checked>
                                    <label class="form-check-label" for="sexo_m">
                                        Masculino
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="sexo" id="sexo_f" value="Femenino">
                                    <label class="form-check-label" for="sexo_f">
                                        Femenino
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Teléfono</label>
                            <input type="number" name="telefono" class="form-control" required />
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Seleccione el Cargo</label>
                            <select name="cargo" class="form-select" required>
                                <option selected value="">Seleccione</option>
                                <option value="Gerente">Gerente</option>
                                <option value="Asistente">Asistente</option>
                                <option value="Analista">Analista</option>
                                <option value="Contador">Contador</option>
                                <option value="Secretario">Secretario</option>
                                <option value="Desarrollador Web">Desarrollador Web</option>
                            </select>
                        </div>
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary btn_add" onclick="window.addNuevoEmpleado(event)">
                                Registrar nuevo empleado
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>