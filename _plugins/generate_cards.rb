Jekyll::Hooks.register :site, :post_render do |site|
  system "python tools/process_cards.py"
end
