export class DependencyMap {
  #map = new OneWayDependencyMap();
  #reverseMap = new OneWayDependencyMap();

  /**
   * @param {string} source
   * @param {readonly string[]} newDeps
   */
  set(source, newDeps) {
    const oldDeps = this.#map.get(source);
    oldDeps?.forEach((dep) => this.#reverseMap.unlink(dep, source));
    this.#map.set(source, newDeps);
    newDeps.forEach((dep) => this.#reverseMap.link(dep, source));
  }

  /**
   * @param {string} dep
   * @returns
   */
  getSources(dep) {
    return this.#reverseMap.get(dep)
  }
}

class OneWayDependencyMap {
  /** @type {Map<string, Set<string>>} */
  #map = new Map();

  /**
   * @param {string} source
   * @param {readonly string[]} targets
   */
  set(source, targets) {
    if (targets.length) {
      this.#map.set(source, new Set(targets));
    } else {
      this.#map.delete(source);
    }
  }

  /**
   * @param {string} source
   * @returns {ReadonlySet<string>?}
   */
  get(source) {
    return this.#map.get(source);
  }

  /**
   * @param {string} source
   * @param {string} target
   */
  unlink(source, target) {
    const set = this.#map.get(source);
    if (!set) return;

    set.delete(target);
    if (!set.size) {
      this.#map.delete(source);
    }
  }

  /**
   * @param {string} source
   * @param {string} target
   */
  link(source, target) {
    const set = this.#map.get(source) ?? new Set()
    set.add(target)
    this.#map.set(source, set);
  }
}
