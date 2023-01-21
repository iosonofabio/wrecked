Jekyll::Hooks.register :site, :pre_render do |site|
  system "python tools/process_cards.py"
end
