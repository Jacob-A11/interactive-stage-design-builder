import { CanvasPanel } from './components/CanvasPanel';
import { InspectorPanel } from './components/InspectorPanel';
import { TemplatesAndLibraryPanel } from './components/TemplatesAndLibraryPanel';
import { TopBar } from './components/TopBar';
import { useStageBuilder } from './hooks/useStageBuilder';

function App() {
  const {
    project,
    selectedId,
    selectedElement,
    zoom,
    toast,
    quickSeats,
    svgRef,
    fileInputRef,
    undoStack,
    redoStack,
    stageTokens,
    worldHeight,
    viewBox,
    orderedElements,
    setSelectedId,
    setQuickSeats,
    updateStage,
    addElement,
    patchSelected,
    deleteSelected,
    duplicateSelected,
    bringSelectedToFront,
    toggleLockSelected,
    toggleVisibilitySelected,
    performUndo,
    performRedo,
    handleCanvasPointerMove,
    finishDrag,
    startDrag,
    addSeatingBlock,
    loadTemplate,
    resetProject,
    handleExportSvg,
    handleExportPng,
    handleSaveJson,
    triggerJsonImport,
    handleImport,
    zoomIn,
    zoomOut,
  } = useStageBuilder();

  return (
    <div className="app-shell">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleImport}
      />

      <TopBar
        title={project.stage.title}
        undoDisabled={undoStack.length === 0}
        redoDisabled={redoStack.length === 0}
        onUndo={performUndo}
        onRedo={performRedo}
        onSaveJson={handleSaveJson}
        onLoadJson={triggerJsonImport}
        onExportPng={handleExportPng}
        onExportSvg={handleExportSvg}
      />

      <main className="layout-grid">
        <TemplatesAndLibraryPanel
          quickSeats={quickSeats}
          onQuickSeatsChange={setQuickSeats}
          onAddElement={addElement}
          onGenerateSeating={addSeatingBlock}
          onLoadTemplate={loadTemplate}
          onResetProject={resetProject}
        />

        <CanvasPanel
          svgRef={svgRef}
          viewBox={viewBox}
          worldHeight={worldHeight}
          zoom={zoom}
          project={project}
          orderedElements={orderedElements}
          selectedId={selectedId}
          toast={toast}
          stageTokens={stageTokens}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onUpdateStage={updateStage}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={finishDrag}
          onClearSelection={() => setSelectedId(null)}
          onStartDrag={startDrag}
        />

        <InspectorPanel
          project={project}
          orderedElements={orderedElements}
          selectedId={selectedId}
          selectedElement={selectedElement}
          onSelectElement={setSelectedId}
          onUpdateStage={updateStage}
          onPatchSelected={patchSelected}
          onDuplicateSelected={duplicateSelected}
          onBringSelectedToFront={bringSelectedToFront}
          onToggleLockSelected={toggleLockSelected}
          onToggleVisibilitySelected={toggleVisibilitySelected}
          onDeleteSelected={deleteSelected}
        />
      </main>
    </div>
  );
}

export default App;
