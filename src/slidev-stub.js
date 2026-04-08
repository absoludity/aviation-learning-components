// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

// Stub for @slidev/client — used when running outside of a Slidev project.
// Components that import useSlideContext will always receive a 'slide' context,
// causing them to render normally rather than skipping overview/preview modes.
import { ref } from 'vue'

export function useSlideContext() {
  return { $renderContext: ref('slide') }
}

export function useNav() {
  return { currentSlideRoute: ref(null) }
}
