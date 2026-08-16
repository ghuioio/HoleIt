import {
    _decorator,
    Color,
    Component,
    Material,
    MeshRenderer,
    Node,
    Vec3,
    utils,
} from 'cc';

const { ccclass, property } = _decorator;

@ccclass('HoleVisual')
export class HoleVisual extends Component {
    @property({ type: Node, tooltip: 'Child root containing the rim/black cylinder visual. Do not assign the movement root itself.' })
    public scaleRoot: Node | null = null;

    @property({ tooltip: 'Radius represented by scaleRoot scale = 1.' })
    public baseRadius = 0.5;

    @property({ tooltip: 'Build a beveled rim, recessed wall and dark bottom at runtime.' })
    public useDepthVisual = true;

    @property({ tooltip: 'Number of radial segments used by the generated hole mesh.' })
    public radialSegments = 48;

    @property({ tooltip: 'Local distance from the upper rim to the recessed bottom.' })
    public visualDepth = 0.03;

    private readonly _baseScale = new Vec3(1, 1, 1);
    private readonly _generatedMaterials: Material[] = [];

    protected onLoad(): void {
        if (this.scaleRoot) {
            this._baseScale.set(this.scaleRoot.scale);
            if (this.useDepthVisual) {
                this.buildDepthVisual();
            }
        }
    }

    protected onDestroy(): void {
        for (const material of this._generatedMaterials) {
            material.destroy();
        }
        this._generatedMaterials.length = 0;
    }

    public setRadius(radius: number): void {
        if (!this.scaleRoot || this.baseRadius <= 0) {
            return;
        }
        const scale = radius / this.baseRadius;
        this.scaleRoot.setScale(
            this._baseScale.x * scale,
            this._baseScale.y,
            this._baseScale.z * scale,
        );
    }

    /**
     * Generates a real recessed surface instead of relying on two almost-flat cylinders.
     * Keeping it under scaleRoot means the gameplay growth animation remains unchanged.
     */
    private buildDepthVisual(): void {
        if (!this.scaleRoot || this.scaleRoot.getChildByName('GeneratedHoleDepth')) {
            return;
        }

        // The old cylinders are retained in the scene as an easy fallback, but hidden while
        // the generated visual is active.
        const legacyRim = this.scaleRoot.getChildByName('Rim');
        const legacyBottom = this.scaleRoot.getChildByName('BlackBottom');
        if (legacyRim) {
            legacyRim.active = false;
        }
        if (legacyBottom) {
            legacyBottom.active = false;
        }

        const root = new Node('GeneratedHoleDepth');
        root.layer = this.scaleRoot.layer;
        root.setParent(this.scaleRoot);

        const segments = Math.max(24, Math.min(96, Math.floor(this.radialSegments)));
        const outerRadius = this.baseRadius;
        const rimInnerRadius = outerRadius * 0.82;
        const bottomRadius = outerRadius * 0.68;
        const rimY = 0.008;
        // Hole is positioned 0.03 above the ground in Game.scene. Keep the bottom just
        // above the ground plane so it remains visible while still projecting as recessed.
        const bottomY = rimY - Math.max(0.012, Math.min(0.036, this.visualDepth));

        // Unlit colors keep the cavity readable under the very bright directional light
        // used by this playable. The inner shadow band is intentionally broad at Lv.1.
        const rimMaterial = this.createMaterial(new Color(156, 205, 195, 255), false);
        const highlightMaterial = this.createMaterial(new Color(231, 244, 218, 255), false);
        const wallMaterial = this.createMaterial(new Color(45, 78, 78, 255), false);
        const bottomMaterial = this.createMaterial(new Color(3, 6, 8, 255), false);

        this.createMeshNode(
            root,
            'BeveledRim',
            this.createAnnulusGeometry(outerRadius, rimInnerRadius, rimY, segments),
            rimMaterial,
        );
        this.createMeshNode(
            root,
            'RimHighlight',
            this.createAnnulusGeometry(outerRadius, outerRadius * 0.94, rimY + 0.001, segments),
            highlightMaterial,
        );
        this.createMeshNode(
            root,
            'CavityShadowBand',
            this.createAnnulusGeometry(
                rimInnerRadius * 1.005,
                bottomRadius * 0.95,
                rimY - 0.0015,
                segments,
            ),
            wallMaterial,
        );
        this.createMeshNode(
            root,
            'InnerWall',
            this.createInnerWallGeometry(
                rimInnerRadius,
                bottomRadius,
                rimY - 0.001,
                bottomY,
                segments,
            ),
            wallMaterial,
        );
        this.createMeshNode(
            root,
            'DeepBottom',
            this.createDiscGeometry(bottomRadius * 1.015, bottomY + 0.0005, segments),
            bottomMaterial,
        );
    }

    private createMeshNode(
        parent: Node,
        name: string,
        geometry: {
            positions: number[];
            normals: number[];
            uvs: number[];
            indices: number[];
            minPos: Vec3;
            maxPos: Vec3;
        },
        material: Material,
    ): void {
        const node = new Node(name);
        node.layer = parent.layer;
        node.setParent(parent);

        const renderer = node.addComponent(MeshRenderer);
        renderer.mesh = utils.createMesh(geometry);
        renderer.setMaterial(material, 0);
        renderer.shadowCastingMode = 0;
        renderer.shadowReceivingMode = 0;
    }

    private createMaterial(color: Color, lit: boolean): Material {
        const material = new Material();
        material.initialize({
            effectName: lit ? 'standard' : 'unlit',
            defines: lit ? {} : { USE_COLOR: true },
        });
        material.setProperty('mainColor', color);
        if (lit) {
            material.setProperty('roughness', 0.9);
            material.setProperty('metallic', 0);
        }
        this._generatedMaterials.push(material);
        return material;
    }

    private createAnnulusGeometry(
        outerRadius: number,
        innerRadius: number,
        y: number,
        segments: number,
    ) {
        const positions: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];
        const indices: number[] = [];

        for (let i = 0; i <= segments; i++) {
            const angle = i / segments * Math.PI * 2;
            const x = Math.cos(angle);
            const z = Math.sin(angle);
            positions.push(x * outerRadius, y, z * outerRadius);
            positions.push(x * innerRadius, y, z * innerRadius);
            normals.push(0, 1, 0, 0, 1, 0);
            uvs.push(x * 0.5 + 0.5, z * 0.5 + 0.5);
            uvs.push(x * innerRadius / outerRadius * 0.5 + 0.5, z * innerRadius / outerRadius * 0.5 + 0.5);
        }

        for (let i = 0; i < segments; i++) {
            const outer = i * 2;
            const inner = outer + 1;
            const nextOuter = outer + 2;
            const nextInner = outer + 3;
            indices.push(outer, inner, nextOuter, nextOuter, inner, nextInner);
        }

        return {
            positions,
            normals,
            uvs,
            indices,
            minPos: new Vec3(-outerRadius, y, -outerRadius),
            maxPos: new Vec3(outerRadius, y, outerRadius),
        };
    }

    private createInnerWallGeometry(
        topRadius: number,
        bottomRadius: number,
        topY: number,
        bottomY: number,
        segments: number,
    ) {
        const positions: number[] = [];
        const normals: number[] = [];
        const uvs: number[] = [];
        const indices: number[] = [];
        const radialChange = Math.max(0.0001, topRadius - bottomRadius);
        const height = Math.max(0.0001, topY - bottomY);
        const normalLength = Math.sqrt(height * height + radialChange * radialChange);
        const radialNormal = height / normalLength;
        const upNormal = radialChange / normalLength;

        for (let i = 0; i <= segments; i++) {
            const angle = i / segments * Math.PI * 2;
            const x = Math.cos(angle);
            const z = Math.sin(angle);
            positions.push(x * topRadius, topY, z * topRadius);
            positions.push(x * bottomRadius, bottomY, z * bottomRadius);
            // Inward/upward normals make the wall react to the scene light like a cavity.
            normals.push(-x * radialNormal, upNormal, -z * radialNormal);
            normals.push(-x * radialNormal, upNormal, -z * radialNormal);
            uvs.push(i / segments, 1, i / segments, 0);
        }

        for (let i = 0; i < segments; i++) {
            const top = i * 2;
            const bottom = top + 1;
            const nextTop = top + 2;
            const nextBottom = top + 3;
            indices.push(top, bottom, nextTop, nextTop, bottom, nextBottom);
        }

        return {
            positions,
            normals,
            uvs,
            indices,
            minPos: new Vec3(-topRadius, bottomY, -topRadius),
            maxPos: new Vec3(topRadius, topY, topRadius),
        };
    }

    private createDiscGeometry(radius: number, y: number, segments: number) {
        const positions: number[] = [0, y, 0];
        const normals: number[] = [0, 1, 0];
        const uvs: number[] = [0.5, 0.5];
        const indices: number[] = [];

        for (let i = 0; i <= segments; i++) {
            const angle = i / segments * Math.PI * 2;
            const x = Math.cos(angle);
            const z = Math.sin(angle);
            positions.push(x * radius, y, z * radius);
            normals.push(0, 1, 0);
            uvs.push(x * 0.5 + 0.5, z * 0.5 + 0.5);
        }

        for (let i = 0; i < segments; i++) {
            // Counter-clockwise from above so the recessed bottom is not back-face culled.
            indices.push(0, i + 2, i + 1);
        }

        return {
            positions,
            normals,
            uvs,
            indices,
            minPos: new Vec3(-radius, y, -radius),
            maxPos: new Vec3(radius, y, radius),
        };
    }
}
