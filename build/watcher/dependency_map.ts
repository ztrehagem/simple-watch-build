export class DependencyMap<Source, Target> {
  readonly #map = new OneWayDependencyMap<Source, Target>();
  readonly #reverseMap = new OneWayDependencyMap<Target, Source>();

  set(source: Source, newDeps: readonly Target[]): void {
    const oldDeps = this.#map.get(source);
    oldDeps?.forEach((dep) => this.#reverseMap.unlink(dep, source));
    this.#map.set(source, newDeps);
    newDeps.forEach((dep) => this.#reverseMap.link(dep, source));
  }

  getSources(dep: Target): ReadonlySet<Source> | undefined {
    return this.#reverseMap.get(dep)
  }
}

class OneWayDependencyMap<Source, Target> {
  readonly #map = new Map<Source, Set<Target>>();

  set(source: Source, targets: readonly Target[]): void {
    if (targets.length) {
      this.#map.set(source, new Set(targets));
    } else {
      this.#map.delete(source);
    }
  }

  get(source: Source): ReadonlySet<Target> | undefined {
    return this.#map.get(source);
  }

  unlink(source: Source, target: Target): void {
    const set = this.#map.get(source);
    if (!set) return;

    set.delete(target);
    if (!set.size) {
      this.#map.delete(source);
    }
  }

  link(source: Source, target: Target): void {
    const set = this.#map.get(source) ?? new Set()
    set.add(target)
    this.#map.set(source, set);
  }
}
