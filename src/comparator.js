/**
 * api-spec-diff: OpenAPI Breaking Change Comparator
 */

export function compareOpenApiSpecs(oldSpec, newSpec) {
  const breakingChanges = [];
  const nonBreakingChanges = [];

  const oldPaths = oldSpec.paths || {};
  const newPaths = newSpec.paths || {};

  // 1. Check for removed endpoints (Breaking)
  for (const path of Object.keys(oldPaths)) {
    if (!newPaths[path]) {
      breakingChanges.push({
        type: 'endpoint-removed',
        message: `Removed entire endpoint path: "${path}"`
      });
      continue;
    }

    const oldMethods = oldPaths[path];
    const newMethods = newPaths[path];

    for (const method of Object.keys(oldMethods)) {
      if (!newMethods[method]) {
        breakingChanges.push({
          type: 'method-removed',
          message: `Removed HTTP method: ${method.toUpperCase()} "${path}"`
        });
        continue;
      }

      // Compare parameters
      const oldParams = oldMethods[method].parameters || [];
      const newParams = newMethods[method].parameters || [];

      // Check for newly added required parameters (Breaking)
      for (const np of newParams) {
        const existed = oldParams.find((op) => op.name === np.name && op.in === np.in);
        if (!existed && np.required) {
          breakingChanges.push({
            type: 'required-param-added',
            message: `Added new REQUIRED parameter "${np.name}" in ${np.in} for ${method.toUpperCase()} "${path}"`
          });
        }
      }

      // Check for removed parameters
      for (const op of oldParams) {
        const stillExists = newParams.find((np) => np.name === op.name && op.in === np.in);
        if (!stillExists && op.required) {
          breakingChanges.push({
            type: 'required-param-removed',
            message: `Removed parameter "${op.name}" for ${method.toUpperCase()} "${path}"`
          });
        }
      }
    }
  }

  // 2. Check for added endpoints (Non-Breaking)
  for (const path of Object.keys(newPaths)) {
    if (!oldPaths[path]) {
      nonBreakingChanges.push({
        type: 'endpoint-added',
        message: `Added new endpoint path: "${path}"`
      });
      continue;
    }

    const oldMethods = oldPaths[path];
    const newMethods = newPaths[path];
    for (const method of Object.keys(newMethods)) {
      if (!oldMethods[method]) {
        nonBreakingChanges.push({
          type: 'method-added',
          message: `Added new HTTP method: ${method.toUpperCase()} "${path}"`
        });
      }
    }
  }

  const hasBreaking = breakingChanges.length > 0;

  return {
    hasBreaking,
    totalChanges: breakingChanges.length + nonBreakingChanges.length,
    breakingChanges,
    nonBreakingChanges
  };
}

